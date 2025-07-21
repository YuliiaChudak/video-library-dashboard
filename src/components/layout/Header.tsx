import { VideoCameraIcon } from '@heroicons/react/24/outline';

type HeaderProps = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export function Header({
  title = 'Video Library',
  subtitle = 'Manage and browse your video collection',
  children,
}: HeaderProps) {
  return (
    <div className="mb-16">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <VideoCameraIcon className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
          {subtitle && <p className="mt-1 text-gray-600">{subtitle}</p>}
        </div>

        <div className="flex-shrink-0">{children}</div>
      </div>
    </div>
  );
}
