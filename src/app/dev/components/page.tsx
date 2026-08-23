import { Button } from "@/components/ui/button";

const variants = ["fill", "weak"] as const;
const colors = ["primary", "danger", "dark"] as const;
const sizes = ["small", "medium", "large", "xlarge"] as const;

export default function ComponentsPage() {
  return (
    <main className="flex flex-col gap-8 p-5">
      <h1 className="text-t2 font-bold">Button</h1>

      <section className="flex flex-col gap-4">
        <h2 className="text-b2 text-fg-neutral-muted font-medium">
          variant · color · size
        </h2>
        {variants.map((variant) =>
          colors.map((color) => (
            <div key={`${variant}-${color}`} className="flex flex-col gap-2">
              <p className="text-e1 text-fg-neutral-subtle">
                {variant} · {color}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {sizes.map((size) => (
                  <Button
                    key={size}
                    variant={variant}
                    color={color}
                    size={size}
                  >
                    메인 액션
                  </Button>
                ))}
              </div>
            </div>
          )),
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-b2 text-fg-neutral-muted font-medium">
          states · size=large
        </h2>
        {variants.map((variant) =>
          colors.map((color) => (
            <div
              key={`state-${variant}-${color}`}
              className="flex flex-col gap-2"
            >
              <p className="text-e1 text-fg-neutral-subtle">
                {variant} · {color}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant={variant} color={color} size="large">
                  메인 액션
                </Button>
                <Button variant={variant} color={color} size="large" disabled>
                  메인 액션
                </Button>
                <Button variant={variant} color={color} size="large" isLoading>
                  메인 액션
                </Button>
              </div>
            </div>
          )),
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-b2 text-fg-neutral-muted font-medium">
          풀폭 (사용처에서 stretch)
        </h2>
        <Button size="xlarge" className="w-full">
          메인 액션
        </Button>
      </section>
    </main>
  );
}
