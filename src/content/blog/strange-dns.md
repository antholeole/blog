---
title: "A Most Curious DNS Record: A Kubernetes Story"
description: A walk through a Kubernetes home server.
pubDate: May 03, 2025
---

Point your browser to `dashboard.oleina.xyz`. Most likely, your browser tells you that the host could not be reached (There are many, many other things that could happen here - for instance, somewhere between the DNS server and your browser, it may refuse to actually serve the record to protect you from DNS rebinding attacks. If you have something running on your private network, you may instead get SSL errors. More on both those later, but this line is too good of a hook to not include.).

Mine points to Kubernetes Dashboard - over HTTPS to boot!

![my browser resolving the dashboard request](/images/dashboard.png)

So what's going on here? How could me and you both get different responses from the same URL? Let me take you through a journey of a most curious DNS record.

## Part 1: Pretext

I tell my girlfriend that I want to self-host a cookbook app because it'll save us $10 a month on a cookbook app subscription - those of us who like to tinker know that the cookbook app is merely a byproduct of the fun part: setting up a home server.

Some services should be exposed to the internet: say, a drawing app that I connect to with an iPad ([draw.oleina.xyz](draw.oleina.xyz)). But there are some services which I would never use when not at home: [a web-ui for kubernetes, for instance](https://github.com/kubernetes/dashboard). Still, Kubernetes dashboard is useless for anyone but me - but even if I know how to edit `/etc/hosts`, I don't know how to do it for my iPhone.

The challenge, then, in plain English: setup some sort of private routing system such that any device plugged into the network can navigate their browser to a URL and land on a page I want them to land on. Do it in such a way that I can have non-experts be able to access internal services.

## Part 2: The Platform

I wrote [another post](/blog_directory/home-server/) on the architecture of my home server, but I had neglected to mention how it serves the internet. One would think that it's standard: DNS entry that points to my router's IP, which then routes the request to the correct device. One would be incorrect, because instead of going the regular Comcast internet-call-techs-to-your-home route, I've been using T-Mobile home internet. It's great, and works very well out of the box, but any configuration is DOA. The easiest way I could set it up was to use [cloudflare tunnels](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/), which integrates well into Kubernetes to expose a service to the external world.

For services that I don't want to expose to the outside world, though, tunnels is not a great solution. The reason being is pretty trivial: once the traffic leaves the network, it can never come back - requests to an internal address should, for the most part, never leave the network.

We'll be using all the standard kubernetes tools and contorting them to our will: cert-manager, external DNS, ingress-nginx will be the major players, just as you would expect from a cluster that does ingress the regular way.

## Part 3: The Nitty Gritty

Let's start with what K3s gives you out of the box. It tries to be very helpful, and it installs two separate programs that work together to give you an ingress out of the box: traefik and servicelb. We'll want to remove those both, since they're not helpful for us.

```nix
  services.k3s = {
    enable = true;
    # ... some nix here...
    moreFlags = [
      "--disable=traefik"
      "--disable=servicelb"
    ];
  };

```

Why? We'll start with traefik. Traefik does not expose the correct info to tell external-dns what it should point to, so the annotation `external-dns.alpha.kubernetes.io/target` is required. We could hard-code the IP of one of our nodes and be done, but where's the fun in that? Hard coding IP's is the exact thing I'd like to avoid. Ideally, we don't have to hard-code anything (I couldn't re-find the GitHub issue for this, but this is because traefik does not expose enough information for external-dns to be able to derive the IP of the nginx pod, so you have to expose that info for it.).

Disabling servicelb is a natural fallout for something that happens a little later down the line, so I'll defer for now, but it becomes clear shortly why this must happen.

The next step is to install ingress-nginx. Very easy - just put in the helm chart:

```nix
    services.k3s.manifests.ingress-nginx = {
      enable = true;
      content = lib.kubelib.fromHelm {
        inherit namespace;

        name = "ingress-nginx";
        chart = pkgs.helm-charts.kubernetes-ingress-nginx.ingress-nginx;

        values = {
          # more here in a second!
        };
      };
    };
```

deploying that onto the server, and we have an ingress-nginx namespace and controller.

```console
$  kubectl get pods -n ingress-nginx
NAME                                   READY   STATUS      RESTARTS   AGE
ingress-nginx-admission-create-476zk   0/1     Completed   0          20h
ingress-nginx-admission-patch-89bxs    0/1     Completed   0          20h
ingress-nginx-controller-6w9fq         1/1     Running     0          20h
```

And wide?

```console
$ kubectl get pods -n ingress-nginx -o wide
NAME                                   READY   STATUS      RESTARTS   AGE   IP               NODE          NOMINATED NODE   READINESS GATES
ingress-nginx-admission-create-476zk   0/1     Completed   0          20h   <none>           microserver   <none>           <none>
ingress-nginx-admission-patch-89bxs    0/1     Completed   0          20h   <none>           microserver   <none>           <none>
ingress-nginx-controller-6w9fq         1/1     Running     0          20h   <none>           microserver   <none>           <none>
```

Whoops! The ingress-nginx resource does not bind to an external IP. This is a problem for multiple reasons. First, we won't be able to talk to it at all from outside the cluster, which defeats the purpose. But second, external-dns will still have no idea where to point the DNS record to. We're back to square one, except we've ripped out traefik and have made our problem worse using ingress-nginx.

A little sidequest here: we should make sure to setup an [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) at some point, but for right now, contacting anything that correctly talks to Nginx will just give us a 404. Here's a simple way to verify that:

```console
$ kubectl get services -n ingress-nginx
NAME                                 TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)                      AGE
ingress-nginx-controller             LoadBalancer   10.43.119.131   <none>           80:31497/TCP,443:32014/TCP   20h
ingress-nginx-controller-admission   ClusterIP      10.43.63.74     <none>           443/TCP                      20h

$ kubectl run -it --rm --restart=Never debug-image --image=alpine/curl /bin/sh
$ curl ingress-nginx-controller.ingress-nginx:80
<html>
<head><title>404 Not Found</title></head>
<body>
<center><h1>404 Not Found</h1></center>
<hr><center>nginx</center>
</body>
</html>
```

We got a response; we had to do it from inside the cluster (because anything outside the cluster isn't able to resolve where to route the request to, among other problems) but that proves that if we can get a 404 from the outside world, we can use the ingress.

A good strategy for finding all the knobs of a service is to go track down their `values.yaml`. For non-helm chart users, `values.yaml` specifies all the input parameters that a helm chart takes. [Here's ingress-nginx's](https://github.com/kubernetes/ingress-nginx/blob/main/charts/ingress-nginx/values.yaml). What are we looking for, though? It's not straight forward. How do we know we can expose services to the outside world? One very easy way to do it is to use a `NodePort` service. We don't even need an ingress for that: we can just set our final destination service type to NodePort, select a high port and point our browser to it. But again, no one can remember IPs, especially if we're operating under the assumption that those IP's are unstable.

Another way is to set a pod to use the host network. That way, we totally ignore all of the internal networking and use the hosts network for everything: that is, the hosts DNS, the hosts ports... We don't want to do that for every single Deployment we use - for one, they'll conflict once you have more than one deployment since you'll likely want ports 80 and 443, but second that's just not how cert-manager and external-dns work. Can we tell ingress-nginx to use the host network?

[bingo](https://github.com/kubernetes/ingress-nginx/blob/28004d3dfc5fe9101bfb548c7989b53d239cc9f5/charts/ingress-nginx/values.yaml#L108)! We can. This means that the NGINX pods will try to bind to the hosts port 80 and 443. You'll note that this is slightly different than setting hostNetwork true - we don't want all the communication to be done through the host network (I don't have a well-thought-out threat model here, but it's always good practice to expose the least attack surface area possible.), we just want to bind to the host ports. There is another value we should set, though:

```nix
values = {
  # this is what we talked about.
  hostPort.enable = true;

  # this is the new value!
  kind = "DaemonSet";
};
```

If we're using the hosts port 80 and 443, there can only ever be one ingress-nginx controller per node. If we were to try to schedule another, they would both try to use those ports, which is not possible. If we tell ingress-nginx to be a DaemonSet, we guarantee exactly one pod per node. This is exactly what we need - and this way, we can point the DNS record to any of our nodes and the port will work as intended, and traffic will get routed to where it needs to be. Note that this isn't really a load balancer - it's totally possible that all traffic gets routed to a single instance of nginx-ingress. I don't intend to have more than 5 qpd (that's queries per day, for those of us who don't understand the metrics people with 0 users use.) so one pod is more than sufficient.

Deploying _that_ though makes the reason why `disable=servicelb` required immediately apparent. Inspecting the `nginx-controller` pod shows us that the ports are already in use. Disabling `servicelb` clears that right up.

And just like that, we should have an external IP:

```console
$ kubectl get services -n ingress-nginx
NAME                                 TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)                      AGE
ingress-nginx-controller             LoadBalancer   10.43.119.131   192.168.12.167   80:31497/TCP,443:32014/TCP   21h
ingress-nginx-controller-admission   ClusterIP      10.43.63.74     <none>           443/TCP                      21h
```

At this point, `external-dns` clicks into place! If `external-dns` is configured properly (and it should work just as it does out of the box) we end up with a DNS A record that points to the IP.

![the dns record](/images/dns_cert.png)

> An aside: Why not use metallb for this? You absolutely totally could. Infact, if I were running in almost any other context, I would use metallb in a heartbeat. I chose to not use it for a couple reasons, the first being that I don't know the IP range that my router assigns. I have no idea if I select an IP range that the router will conflict with. Second, because my expected traffic is very, very low, scaling up nginx pods is likely never going to happen. One pod per node to open up the port is more than good enough - and we lean on the router's assignment of private IPs so we never have to worry about IP ranges conflicting. 

### SSL Certs

Things are almost working. We've said nothing of SSL certs - despite the traffic staying within my home network, it would still be helpful to encrypt the traffic - although I'd be lying if I said the primary motivator for installing SSL certs is security and not removing the big red `DANGER` lock that appears in Firefox when you navigate to a HTTP site.

Without going too deep into SSL certs, essentially, you have to convince the certificate authority, in this case LetsEncrypt, that you actually own the domain you're trying to get certs for. Proving why this is required is pretty straightforward: if proof of ownership wasn't required, I could write a cert for your bank, and then hijack the connection between you and your bank using the cert that I just created - thinking you're encrypted, you enter your password. I now decrypt it and bam. If I can't get a cert for the domain name, your browser will be highly suspicious that it isn't connecting to the real host.

Essentially, a challenge is LetsEncrypt giving you a key that it knows, and you putting it behind your domain. Trusted, well-ran DNS servers won't let you write a DNS record for a server you don't own.

What are the different challenge types, though? I really do own the domain (I promise!) but I can't really prove it by putting an HTTP route on my server (This is called a HTTP-01 challenge type.), since LetsEncrypt has no way of contacting my server - remember, it's on my home network! I can, however, write whatever DNS records I please, so you can configure cert-manager to use a DNS01 challenge. Essentially, it writes a record to the DNS server that LetsEncrypt expects to see. This means that the request never goes to your server.

Again, this is pretty standard `cert-manager`, so I won't put the full reasoning here but it's pretty simple to configure this challenge type.

```nix
spec = {
  acme = {
    server = "https://acme-v02.api.letsencrypt.org/directory";
    privateKeySecretRef.name = "blahblah";
    solvers = [
      {
        dns01.cloudflare.apiTokenSecretRef = api-secret;
      }
    ];
  };
};
```

---

And that's it! When I point my browser to `dashboard.oleina.xyz`, it first grabs the DNS record. Firefox sees that it should talk to the IP of my home server - Firefox fires off that request, to which my router understands that this is a private IP and to not send it off to the rest of the world. Instead, it redirects the query to the server on my home network. ingress-nginx is listening to requests on the default ports, and takes it from there: the request moves from the real world to Kubernetes land, and my pods handle the request. The entire system unwinds and the browser is populated with whatever I choose to serve.


