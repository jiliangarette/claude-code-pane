import { Button } from '../components/ui'

export const NotFound = () => (
  <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center">
    <div className="grid grid-cols-2 gap-2">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`h-16 w-16 rounded-md border ${i === 3 ? 'border-dashed border-faint' : 'border-accent/40 bg-accent/[0.05]'}`}
        />
      ))}
    </div>
    <h1 className="mt-10 text-5xl font-bold">No pane here.</h1>
    <p className="mt-4 font-mono text-sm text-mut">That route didn't tile. Head back to the grid.</p>
    <div className="mt-8"><Button to="/">Go home</Button></div>
  </section>
)
