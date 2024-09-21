import { Token } from '@/app/(pages)/box/create/components/token';
import * as React from 'react';

interface CommonOutputPreviewProps {
  tokens: string[];
}

export function CommonOutputPreview({ tokens }: CommonOutputPreviewProps) {
  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-[4px] bg-[#E8E8E8]">
      <p className="text-base leading-4">Get:</p>
      <div className="flex items-center gap-1">
        {
          tokens.map((token, index) => (
            <React.Fragment key={`output-config-${token}-${index}`}>
              <Token token={token} />
              {index < tokens.length - 1 ? <div className="text-base leading-4">and</div> : null}
            </React.Fragment>
          ))
        }
      </div>
    </div>
  )
}

CommonOutputPreview.displayName = 'CommonOutputPreview';