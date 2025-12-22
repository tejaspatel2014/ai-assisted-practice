import React from 'react';
import { render, screen } from '@testing-library/react';
import Hello from '../components/Hello';

describe('Hello component', () => {
  it('renders Hello, World! text', () => {
    render(<Hello />);
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });
});
