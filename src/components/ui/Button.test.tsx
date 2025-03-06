import { render, screen } from '@testing-library/react';
import { vi, expect, describe, test } from 'vitest';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Button } from './Button';

describe('Button', () => {
  test('renders correctly with default props', () => {
    render(<Button data-testid="test-button">テストボタン</Button>);
    expect(screen.getByTestId('test-button')).toBeInTheDocument();
  });

  test('applies primary variant class correctly', () => {
    render(<Button variant="primary">プライマリボタン</Button>);
    const button = screen.getByText('プライマリボタン');
    expect(button).toHaveClass('bg-indigo-600');
  });

  test('applies secondary variant class correctly', () => {
    render(<Button variant="secondary">セカンダリボタン</Button>);
    const button = screen.getByText('セカンダリボタン');
    expect(button).toHaveClass('bg-white');
  });

  test('applies danger variant class correctly', () => {
    render(<Button variant="danger">危険ボタン</Button>);
    const button = screen.getByText('危険ボタン');
    expect(button).toHaveClass('bg-red-600');
  });

  test('triggers onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>クリックボタン</Button>);
    
    const button = screen.getByText('クリックボタン');
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not trigger onClick when disabled', async () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>無効ボタン</Button>);
    
    const button = screen.getByText('無効ボタン');
    await userEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  test('displays loading spinner when isLoading is true', () => {
    render(<Button isLoading>ローディングボタン</Button>);
    
    // ローディングアイコンの存在確認
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  test('applies opacity when isLoading is true', () => {
    render(<Button isLoading>ローディングボタン</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('opacity-50');
  });

  test('passes additional HTML attributes to the button element', () => {
    render(<Button data-testid="custom-button" title="ボタンのタイトル">属性テスト</Button>);
    const button = screen.getByText('属性テスト');
    
    expect(button).toHaveAttribute('data-testid', 'custom-button');
    expect(button).toHaveAttribute('title', 'ボタンのタイトル');
  });

  test('applies custom className alongside default classes', () => {
    render(<Button className="custom-class">カスタムクラスボタン</Button>);
    const button = screen.getByText('カスタムクラスボタン');
    
    expect(button).toHaveClass('custom-class');
    // デフォルトクラスも適用されていることを確認
    expect(button).toHaveClass('px-4');
  });
}); 