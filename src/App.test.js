import { render, screen } from '@testing-library/react';
import App from './App';

test('renders micro habit tracker heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/micro habit tracker/i);
  expect(headingElement).toBeInTheDocument();
});
