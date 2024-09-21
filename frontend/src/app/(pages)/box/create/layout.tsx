"use client";

import { CreateProvider } from "./components/provider";

const CreateBoxLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mt-10">
      <CreateProvider>
        {children}
      </CreateProvider>
    </div>
  );
}

CreateBoxLayout.displayName = 'CreateBoxLayout';

export default CreateBoxLayout;