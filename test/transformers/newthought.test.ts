import { assert, expect, test } from 'vitest';
import { printAstPlugin, testRemarkPlugin } from './remark';
import { remarkNewthought } from '../../src/transformers/newthought';


test('should newthought double bars', async () => {
	const md = `some ||Hello|| newthought that.`;

	const out = await testRemarkPlugin(md, [remarkNewthought, printAstPlugin])

	expect(out).toEqual('<p>some <span class="newthought">Hello</span> newthought that.</p>')
});

test('should newthought double bars at beginning', async () => {
	const md = `||Hello|| newthought that.`;

	const out = await testRemarkPlugin(md, [remarkNewthought, printAstPlugin])

	expect(out).toEqual('<p><span class="newthought">Hello</span> newthought that.</p>')
});

test('should newthought double bars at end', async () => {
	const md = `Waffle ||Hello||`;

	const out = await testRemarkPlugin(md, [remarkNewthought, printAstPlugin])

	expect(out).toEqual('<p>Waffle <span class="newthought">Hello</span></p>')
});