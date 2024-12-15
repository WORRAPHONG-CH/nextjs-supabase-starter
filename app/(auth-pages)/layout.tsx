export default async function Layout(
  {children,}: {children: React.ReactNode;} // Destructuring children elements
) {
  return (
    <div className="max-w-7xl flex flex-col gap-12 items-start">
      {children}
    </div>
  );
}

// { children }: { children: React.ReactNode }:
// This is destructuring to directly extract the children prop.
// The type { children: React.ReactNode } defines the shape of the props object.
// React.ReactNode: A TypeScript type representing anything that can be rendered in React, such as JSX elements, strings, numbers, fragments, arrays, or null.