import React, { useEffect, useState } from 'react';
import { BuilderComponent, builder } from '@builder.io/react';

// Configure Builder with your Public API Key
const BUILDER_KEY =
  (typeof process !== 'undefined' && process.env && process.env.BUILDER_PUBLIC_KEY) ||
  (import.meta as any)?.env?.VITE_BUILDER_PUBLIC_KEY ||
  '1dd055458dee4aadbe7d7997f7756d21';

builder.init(BUILDER_KEY);

export interface BuilderPageProps {
  modelName?: string;
}

export const BuilderPage: React.FC<BuilderPageProps> = ({ modelName = 'page' }) => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchBuilderContent() {
      try {
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
        const builderContent = await builder
          .get(modelName, {
            userAttributes: {
              urlPath: currentPath,
            },
          })
          .toPromise();

        if (isMounted) {
          setContent(builderContent);
        }
      } catch (err) {
        // Safe fallback - silence network errors for unpublished content
        console.warn('[Builder.io] No published content found or key inactive:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchBuilderContent();

    return () => {
      isMounted = false;
    };
  }, [modelName]);

  // Clean loading handling - return null or subtle loading so layout does not flash
  if (loading) {
    return null;
  }

  // Fallback safely if no content is published yet so existing layouts never break
  if (!content) {
    return null;
  }

  return (
    <div className="builder-component-container w-full">
      <BuilderComponent model={modelName} content={content} />
    </div>
  );
};
