import { expect } from 'chai';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Spectrum from '../../../src/client/components/Spectrum';

describe('client/components/Spectrum', () => {
  afterEach(cleanup);

  it('renders the player name, score and one bar per column', () => {
    const { container, getByText } = render(<Spectrum name="alice" alive score={120} spectrum={[1, 2, 3, 0]} />);
    expect(getByText('alice')).to.exist;
    expect(getByText('120')).to.exist;
    expect(container.querySelectorAll('.spectrum-bar')).to.have.lengthOf(4);

    const eliminated = render(<Spectrum name="bob" alive={false} score={40} spectrum={[]} />);
    expect(eliminated.getByText('bob (out)')).to.exist;
  })
})
