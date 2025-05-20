// app/components/careers/JobOpeningCard.tsx
import React from 'react';
import Link from 'next/link';
import { MapPin, Clock, ArrowRight, Briefcase, Tag } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import type { JobOpening } from '@/app/types/database';
import { formatRelativeDate } from '@/app/lib/utils/date-utils';

interface JobOpeningCardProps {
  job: JobOpening;
  featured?: boolean;
}

const JobOpeningCard: React.FC<JobOpeningCardProps> = ({ job, featured = false }) => {
  // Extraire une courte description (2 premières phrases ou les 150 premiers caractères)
  const shortDescription = () => {
    const sentences = job.description.split(/(?<=[.!?])\s+/);
    if (sentences.length > 2) {
      return sentences.slice(0, 2).join(' ') + '...';
    }
    
    if (job.description.length > 150) {
      return job.description.substring(0, 150) + '...';
    }
    
    return job.description;
  };

  return (
    <div className={`bg-white border rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden ${
      featured ? 'border-purple-300 ring-1 ring-purple-200' : 'border-gray-200'
    }`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            {featured && (
              <Badge variant="jobFeatured" className="mb-2">
                <Tag className="w-3 h-3 mr-1" />
                En vedette
              </Badge>
            )}
            <h3 className="text-xl font-bold text-tekki-blue">{job.title}</h3>
            <div className="flex items-center text-gray-600 text-sm">
              <Briefcase className="h-4 w-4 mr-1.5" />
              <span>{job.department}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="h-4 w-4 mr-1.5" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <Clock className="h-4 w-4 mr-1.5" />
              <span>{job.type}</span>
            </div>
          </div>
          
          <Badge variant={job.is_active ? 'jobActive' : 'jobInactive'} className="flex-shrink-0">
            {job.is_active ? 'Ouvert' : 'Fermé'}
          </Badge>
        </div>
        
        <p className="text-gray-600 mb-6 line-clamp-3">
          {shortDescription()}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Publié {formatRelativeDate(job.created_at)}
          </span>
          
          <Link
            href={`/careers/${job.slug}`}
            className="inline-flex items-center text-tekki-coral hover:text-tekki-coral/80 transition-colors font-medium"
          >
            Voir le poste
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobOpeningCard;