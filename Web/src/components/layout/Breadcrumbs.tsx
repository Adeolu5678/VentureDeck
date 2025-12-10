'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { Fragment } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';

function ProjectBreadcrumb({ id, isLast, href }: { id: string, isLast: boolean, href: string }) {
  const project = useQuery(api.projects.get, { id: id as Id<'projects'> });
  const label = project ? project.title : (isLast ? 'Loading...' : id.slice(0, 8) + '...');

  if (isLast) {
    return <span className="text-white font-medium truncate max-w-[200px]">{label}</span>;
  }
  return (
    <Link href={href} className="hover:text-white transition-colors truncate max-w-[200px]">
      {label}
    </Link>
  );
}

function WorkspaceBreadcrumb({ id, isLast, href }: { id: string, isLast: boolean, href: string }) {
  const workspace = useQuery(api.workspaces.get, { id: id as Id<'workspaces'> });
  const label = workspace ? workspace.name : (isLast ? 'Loading...' : id.slice(0, 8) + '...');

  if (isLast) {
    return <span className="text-white font-medium truncate max-w-[200px]">{label}</span>;
  }
  return (
    <Link href={href} className="hover:text-white transition-colors truncate max-w-[200px]">
      {label}
    </Link>
  );
}

function UserBreadcrumb({ id, isLast, href }: { id: string, isLast: boolean, href: string }) {
  const user = useQuery(api.users.getUser, { id: id as Id<'users'> });
  const label = user ? (user.displayName || user.username || 'User') : (isLast ? 'Loading...' : id.slice(0, 8) + '...');

  if (isLast) {
    return <span className="text-white font-medium truncate max-w-[200px]">{label}</span>;
  }
  return (
    <Link href={href} className="hover:text-white transition-colors truncate max-w-[200px]">
      {label}
    </Link>
  );
}

function ConversationBreadcrumb({ id, isLast, href }: { id: string, isLast: boolean, href: string }) {
  const conversation = useQuery(api.conversations.getConversation, { conversationId: id as Id<'conversations'> });
  
  let label = isLast ? 'Loading...' : id.slice(0, 8) + '...';
  if (conversation) {
    if (conversation.name) {
      label = conversation.name;
    } else if (conversation.type === 'direct') {
      label = 'Direct Message'; // Could be improved if we fetched the other user's name here, but getConversation might not return it easily without more logic
    } else {
      label = 'Chat';
    }
  }

  if (isLast) {
    return <span className="text-white font-medium truncate max-w-[200px]">{label}</span>;
  }
  return (
    <Link href={href} className="hover:text-white transition-colors truncate max-w-[200px]">
      {label}
    </Link>
  );
}

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Don't show on dashboard or home
  if (pathname === '/' || pathname === '/dashboard') return null;

  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center text-sm text-neutral-400 mb-6 overflow-hidden whitespace-nowrap">
      <Link href="/dashboard" className="hover:text-white transition-colors flex-shrink-0">
        <Home className="w-4 h-4" />
      </Link>
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;
        const prevSegment = index > 0 ? segments[index - 1] : null;

        // Determine if this segment is an ID based on the previous segment
        const isProjectId = prevSegment === 'projects' && segment !== 'create';
        const isWorkspaceId = prevSegment === 'workspaces';
        const isUserId = prevSegment === 'users';
        const isConversationId = prevSegment === 'conversations';

        return (
          <Fragment key={href}>
            <ChevronRight className="w-4 h-4 mx-2 text-neutral-600 flex-shrink-0" />
            {isProjectId ? (
              <ProjectBreadcrumb id={segment} isLast={isLast} href={href} />
            ) : isWorkspaceId ? (
              <WorkspaceBreadcrumb id={segment} isLast={isLast} href={href} />
            ) : isUserId ? (
              <UserBreadcrumb id={segment} isLast={isLast} href={href} />
            ) : isConversationId ? (
              <ConversationBreadcrumb id={segment} isLast={isLast} href={href} />
            ) : (
              isLast ? (
                <span className="text-white font-medium capitalize truncate max-w-[200px]">{segment.replace(/-/g, ' ')}</span>
              ) : (
                <Link href={href} className="hover:text-white transition-colors capitalize truncate max-w-[200px]">
                  {segment.replace(/-/g, ' ')}
                </Link>
              )
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
