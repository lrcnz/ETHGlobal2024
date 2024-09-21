"use client";

const CreateBoxLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mt-10">
        {children}
    </div>
  );
}

CreateBoxLayout.displayName = 'CreateBoxLayout';

export default CreateBoxLayout;