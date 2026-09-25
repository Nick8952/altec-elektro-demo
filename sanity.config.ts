"use client";
/**
 * Sanity Studio: wird unter /studio eingebettet, sobald DEPLOY_TARGET=vercel gesetzt ist (siehe server-routes/app/studio).
 * In der GitHub-Pages-Demo ist das Studio nicht enthalten. Status: vorbereitet, nicht gegen ein echtes Projekt getestet.
 * Struktur: Unternehmensdaten und Website-Texte als Einzeldokumente, danach Seiten, Leistungen, Team, Partner.
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { deDELocale } from "@sanity/locale-de-de";
import { schemaTypes } from "./sanity/schemas";
import { apiVersion, dataset, projectId, studioUrl } from "./sanity/env";

const EINZELN = ["einstellungen", "texte"];

export default defineConfig({
  name: "altec-elektro",
  title: "Altec Elektro GmbH: Inhalte",
  basePath: studioUrl,
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    templates: (vorlagen) => vorlagen.filter((v) => !EINZELN.includes(v.schemaType)),
  },
  document: {
    actions: (aktionen, ctx) => (EINZELN.includes(ctx.schemaType) ? aktionen.filter((a) => !["unpublish", "delete", "duplicate"].includes(a.action ?? "")) : aktionen),
  },
  plugins: [
    deDELocale(),
    structureTool({
      structure: (S) =>
        S.list()
          .title("Inhalte")
          .items([
            S.listItem().title("Unternehmensdaten").id("einstellungen").child(S.document().schemaType("einstellungen").documentId("einstellungen")),
            S.listItem().title("Website-Texte").id("texte").child(S.document().schemaType("texte").documentId("texte")),
            S.divider(),
            S.documentTypeListItem("seite").title("Seiten"),
            S.documentTypeListItem("leistung").title("Leistungen"),
            S.documentTypeListItem("teammitglied").title("Team"),
            S.documentTypeListItem("partner").title("Partner"),
          ]),
    }),
    presentationTool({
      previewUrl: { previewMode: { enable: "/api/vorschau/aktivieren", disable: "/api/vorschau/beenden" } },
      resolve: {
        locations: {
          seite: { select: { titel: "titel", slug: "slug.current" }, resolve: (doc) => ({ locations: [{ title: (doc?.titel as string) ?? "Seite", href: doc?.slug === "start" ? "/" : `/${doc?.slug}/` }] }) },
          leistung: { select: { titel: "titel", slug: "slug.current" }, resolve: (doc) => ({ locations: [{ title: (doc?.titel as string) ?? "Leistung", href: `/elektroinstallationen/${doc?.slug}/` }] }) },
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
