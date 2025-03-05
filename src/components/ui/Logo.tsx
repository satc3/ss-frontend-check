import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';

interface LogoProps {
  className?: string;
  showLink?: boolean;
}

export const Logo = ({ className = 'h-10', showLink = true }: LogoProps) => {
  const image = (
    <img
      className={`w-auto ${className}`}
      src={logo}
      alt="SmartSpend"
    />
  );

  if (showLink) {
    return (
      <Link to="/" className="inline-block">
        {image}
      </Link>
    );
  }

  return image;
}; 