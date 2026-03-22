import { Terminal } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center justify-center size-12 rounded-xl bg-primary text-primary-foreground">
      <Terminal className="size-6" />
    </div>
  );
}
