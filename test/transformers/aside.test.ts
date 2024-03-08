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

	
	expect(out).toEqual("<p>Hello! <span class=\"sidenote\">and also...</span> aside.</p>")
});




