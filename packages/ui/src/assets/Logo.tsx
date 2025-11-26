import { LOGO_PATH_D } from './logoPath';

interface LogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
  fill?: string;
}

export const Logo = ({ 
  width = 48, 
  height = 48, 
  className = '', 
  style = {},
  alt = 'Platonic Dice logo',
  fill = '#000000'
}: LogoProps) => {
  return (
    <svg
      version="1.1"
      width={width}
      height={height}
      viewBox="0 0 1280 720"
      className={`logo ${className}`}
      style={style}
      role="img"
      aria-label={alt}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{alt}</title>
      <g>
        <path
          style={{ fill, strokeWidth: 0.32 }}
          d={LOGO_PATH_D}
        />
      </g>
    </svg>
  );
};
