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

	expect(out).toEqual('<p>Hello!<label class="margin-toggle sidenote-number" for="sn-1"></label><input class="margin-toggle" for="sn-1" type="checkbox" id="sn-1"><span class="sidenote">and (nested??) also...</span> aside.</p>')
});

test('subsequent parens should work', async () => {
	const md = `Hello! (first paren) aside and (second paren!) here.`;

	const out = await testRemarkPlugin(md, [remarkAside])

	expect(out).toEqual('<p>Hello!<label class="margin-toggle sidenote-number" for="sn-1"></label><input class="margin-toggle" for="sn-1" type="checkbox" id="sn-1"><span class="sidenote">first paren</span> aside and<label class="margin-toggle sidenote-number" for="sn-2"></label><input class="margin-toggle" for="sn-2" type="checkbox" id="sn-2"><span class="sidenote">second paren!</span> here.</p>')
});

test("should allow other things", async () => {
	const md = "hi _hi_ (hi)"

	const out = await testRemarkPlugin(md, [printAstPlugin, remarkAside])

	expect(out).toEqual('<p>hi <em>hi</em><label class="margin-toggle sidenote-number" for="sn-1"></label><input class="margin-toggle" for="sn-1" type="checkbox" id="sn-1"><span class="sidenote">hi</span></p>')
})




