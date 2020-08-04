import React from 'react';
import { action } from '@storybook/addon-actions';
import {text, withKnobs} from '@storybook/addon-knobs';
import Button from "../src/ts/components/Button";

export default {
  title: 'Button',
  component: Button,
  decorators: [withKnobs]
};


export const Default = () => {
    return(
        <Button btnText={text('Button text', 'My button')} handleClick={action('Button click action')} ></Button>
    );
}
