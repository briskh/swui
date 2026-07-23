import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@swqt/ui";
import { FoundationNotice } from "../components/FoundationNotice";
import { PortalPageHeader } from "../components/PortalPageHeader";
import { FONT_MONO_STACK, FONT_SANS_STACK, FONT_SERIF_STACK, FONT_WEIGHTS, TYPE_SCALE } from "../lib/token-showcase";

export function TypographyPage() {
  return (
    <div className="flex flex-col gap-8">
      <PortalPageHeader
        title="Typography"
        description={
          <p>
            Sans stack for UI controls; system-local serif for reading surfaces. Both ship without CDN or bundled font
            files.
          </p>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Sans stack (`font-sans`)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="font-mono text-sm text-muted-foreground">{FONT_SANS_STACK}</p>
          <p className="font-sans text-base">
            The quick brown fox jumps over the lazy dog. 0123456789 · 设计系统无衬线预览
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Serif stack (`font-serif`)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="font-mono text-sm text-muted-foreground">{FONT_SERIF_STACK}</p>
          <p className="font-serif text-base leading-relaxed">
            The quick brown fox jumps over the lazy dog. Il1 O0 · 设计系统衬线字体预览 · 仅使用操作系统内置字体，不请求外网 CDN。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monospace stack (`font-mono`)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="font-mono text-sm text-muted-foreground">{FONT_MONO_STACK}</p>
          <p className="font-mono text-sm leading-relaxed">
            const token = &quot;--primary&quot;; Il1 O0 · client_id=8f3a2b1c · 等宽字体预览 0123456789
          </p>
        </CardContent>
      </Card>

      <section className="grid gap-4">
        <h3 className="text-lg font-medium">Type scale</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Sample</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TYPE_SCALE.map((row) => (
              <TableRow key={row.label}>
                <TableCell>{row.label}</TableCell>
                <TableCell>
                  <Badge variant="outline">{row.className}</Badge>
                </TableCell>
                <TableCell>
                  <span className={row.className}>{row.sample}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className="grid gap-4">
        <h3 className="text-lg font-medium">Font weights</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Weight</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Sample</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {FONT_WEIGHTS.map((row) => (
              <TableRow key={row.label}>
                <TableCell>{row.label}</TableCell>
                <TableCell>
                  <Badge variant="outline">{row.className}</Badge>
                </TableCell>
                <TableCell>
                  <span className={`text-base ${row.className}`}>{row.sample}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <FoundationNotice>
        <p>
          Hard constraint: only these stacks, sizes, and weights may appear in UI source. See{" "}
          <code>docs/experience/foundation-contract.md</code> and run <code>bun run check:design-contract</code>.
          Control heights live on the spacing scale (<code>h-control-md</code> = 32px default). See{" "}
          <code>packages/ui-tokens/docs/TOKENS.md</code> for the full token tables.
        </p>
      </FoundationNotice>
    </div>
  );
}
