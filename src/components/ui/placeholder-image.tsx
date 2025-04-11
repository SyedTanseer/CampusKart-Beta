import React from 'react';
import { ImageIcon } from 'lucide-react';

interface PlaceholderImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  src,
  alt,
  className,
  fallbackClassName,
  ...props
}) => {
  const [error, setError] = React.useState(false);

  return error ? (
    <div 
      className={`flex items-center justify-center bg-muted ${fallbackClassName || className}`}
      {...props}
    >
      <ImageIcon className="h-10 w-10 text-muted-foreground" />
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
};

export default PlaceholderImage; 