import { assert, expect, test } from 'vitest';
import { printAstPlugin, testRemarkPlugin } from './remark';
import { remarkAside } from '../../src/transformers/asides';


test('should not do anything with no asides', async () => {
	const md = `Hello! no aside.`;

	const out = await testRemarkPlugin(md, [remarkAside])

	expect(out).toEqual("<p>Hello! no aside.</p>")
});


test('should process a paren as an aside', async () => {
	const md = `Hello! (and also...) aside.`;

	const out = await testRemarkPlugin(md, [remarkAside])

	expect(out).toEqual("<p>Hello!<label class=\"margin-toggle sidenote-number\"></label><span class=\"sidenote\">and also...</span> aside.</p>")
});


test('should not double process parents', async () => {
	const md = `Hello! (and (nested??) also...) aside.`;

	const out = await testRemarkPlugin(md, [remarkAside])

	expect(out).toEqual("<p>Hello!<label class=\"margin-toggle sidenote-number\"></label><span class=\"sidenote\">and (nested??) also...</span> aside.</p>")
});

test('subsequent parens should work', async () => {
	const md = `Hello! (first paren) aside and (second paren!) here.`;

	const out = await testRemarkPlugin(md, [remarkAside])

	expect(out).toEqual("<p>Hello!<label class=\"margin-toggle sidenote-number\"></label><span class=\"sidenote\">first paren</span> aside and<label class=\"margin-toggle sidenote-number\"></label><span class=\"sidenote\">second paren!</span> here.</p>")
});

test("should allow other things", async () => {
	const md = `
	This is P1!

	Sometimes, packages in nix will have inputs that we can override; For example, \`ripgrep\` allows us to specify an input \`withPCRE2\` (I have no idea what that input does but its just a boolean so it makes for a good example).
	`
	
	const out = await testRemarkPlugin(md, [printAstPlugin, remarkAside])

	expect(out).toEqual('<p>Sometimes, packages in nix will have inputs that we can override; For example, <code>ripgrep</code> allows us to specify an input <code>withPCRE2</code><label class="margin-toggle sidenote-number"></label><span class="sidenote">I have no idea what that input does but its just a boolean so it makesfor a good example</span>.</p>')
})




