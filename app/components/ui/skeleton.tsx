// app/components/ui/skeleton.tsx
import { cn } from "../../lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Composant Skeleton pour afficher un état de chargement
 * 
 * @example
 * <Skeleton className="h-8 w-48" /> // Barre de chargement de taille personnalisée
 * <Skeleton className="h-12 w-12 rounded-full" /> // Avatar de chargement circulaire
 */
function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-gray-700", className)}
      {...props}
    />
  );
}

export { Skeleton };