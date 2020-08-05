import {text, withKnobs} from '@storybook/addon-knobs';
import {init} from "../src/ts/components/Button";
import '../src/scss/main.scss'
export default {
    title: 'Button',
    decorators: [withKnobs]
};

export const Default = () => {
    const el = document.createElement('div');
    el.innerHTML = `
        <button class="btn" type="button">${text('button text', 'My test-button')}</button>
    `
    init(el.querySelector('.btn'))
    return el

}