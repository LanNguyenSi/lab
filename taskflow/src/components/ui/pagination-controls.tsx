'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-end gap-2 mt-4">
      <div className="text-sm text-muted-foreground mr-2">
        Page {currentPage} of {totalPages}
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
