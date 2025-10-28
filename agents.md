🎯 AI AGENT ACTION GUIDELINES
IMMEDIATE COMPLIANCE CHECKLIST

    ALWAYS use TypeScript with strict mode

    ALWAYS place shared components in shared/components/

    ALWAYS use existing hooks from shared/hooks/ before creating new ones

    ALWAYS check API layer in src/api/ before HTTP calls

    ALWAYS follow SCSS module pattern for styling

    ALWAYS use barrel exports (index.ts) in directories

FILE CREATION DECISION TREE
text

QUESTION: "Where should I create this new component?"
→ Is it reusable across multiple features? → shared/components/
→ Is it a layout block used in multiple pages? → blocks/
→ Is it specific to a single feature? → modules/{feature}/components/

QUESTION: "How should I handle state management?"
→ Local UI state? → useState/useReducer
→ Shared state across components? → Custom hook in shared/hooks/
→ Server state? → React Query in lib/react-query.ts

QUESTION: "Where do I put utility functions?"
→ Used across multiple features? → shared/utils/
→ Feature-specific? → modules/{feature}/utils/
→ API-related? → api/endpoints/

ERROR RESOLUTION PROTOCOL
typescript

// ISSUE: TypeScript compilation errors
1. Check tsconfig.json, tsconfig.app.json, tsconfig.node.json
2. Verify type definitions in global.types.ts and vite-env.d.ts
3. Ensure proper module resolution paths

// ISSUE: Build failures  
1. Examine vite.config.ts for plugin conflicts
2. Check for circular dependencies
3. Verify all imports use correct barrel exports

// ISSUE: Runtime errors
1. Check API configuration in api/config/
2. Verify React Query setup in lib/react-query.ts
3. Validate component props with TypeScript interfaces

📝 CODE GENERATION TEMPLATES
NEW COMPONENT TEMPLATE
typescript

// shared/components/NewComponent/NewComponent.tsx
import React from 'react';
import styles from './NewComponent.module.scss';

interface NewComponentProps {
  title: string;
  variant?: 'default' | 'compact';
  children?: React.ReactNode;
}

export const NewComponent: React.FC<NewComponentProps> = ({
  title,
  variant = 'default',
  children
}) => {
  return (
    <div className={`${styles.container} ${styles[variant]}`}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

// shared/components/NewComponent/NewComponent.module.scss
.container {
  padding: 1rem;
  
  &.compact {
    padding: 0.5rem;
  }
}

.title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

// shared/components/NewComponent/index.ts
export { NewComponent } from './NewComponent';

NEW HOOK TEMPLATE
typescript

// shared/hooks/useNewFeature.ts
import { useState, useEffect } from 'react';

interface UseNewFeatureReturn {
  data: string[];
  isLoading: boolean;
  error: Error | null;
}

export const useNewFeature = (dependencies: any[]): UseNewFeatureReturn => {
  const [data, setData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Implementation
  }, dependencies);

  return { data, isLoading, error };
};

🔍 QUICK REFERENCE DIRECTIVES

FOR COMPONENT DEVELOPMENT: Always check shared/components/ first for existing solutions

FOR STATE MANAGEMENT: Prefer shared/hooks/ over context for reusable logic

FOR API CALLS: Always use api/endpoints/ never direct fetch/axios calls

FOR STYLING: Follow SCSS module pattern with co-located styles

FOR TYPES: Reference global.types.ts for global types, create feature-specific types in modules

FOR NEW FEATURES: Implement in modules/{feature}/ with complete feature encapsulation