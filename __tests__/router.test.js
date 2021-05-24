/**
 * @jest-environment jsdom
 */
import {pushToHistory} from '../scripts/router.js';
describe('myHistory', () => {
    test('isSettings', () => {
        expect(pushToHistory('settings').state).toEqual({ page: 'settings' });
    });
    test('isEntry', () => {
        expect(pushToHistory('entry', 1).state).toEqual({ page: `entry1` });
    });
    test('default', () => {
        expect(pushToHistory('poggers', 69).state).toEqual({});
    });
    test('correctStackSize', () => {
        expect(window.history.length).toBe(4);
    });
});
