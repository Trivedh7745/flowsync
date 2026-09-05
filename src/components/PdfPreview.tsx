"use client";

import { useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

type PdfPreviewProps = {
  pdfUrl: string;
};

export default function PdfPreview({
  pdfUrl,
}: PdfPreviewProps) {
  const [numPages, setNumPages] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const documentOptions = useMemo(
  () => ({
    disableRange: true,
    disableStream: true,
    disableAutoFetch: true,
  }),
  []
);

  const handlePdfLoadSuccess = ({
  numPages,
}: {
  numPages: number;
}) => {
  console.log("PDF TOTAL PAGES:", numPages);

  setNumPages(numPages);
  setCurrentSlide(0);
};

  const safeCurrentPage = Math.min(
    Math.max(currentSlide, 0),
    Math.max(numPages - 1, 0)
  );

    return (
  <div
    className="
      w-full
      max-h-[calc(100vh-180px)]
      overflow-y-auto
      pr-2
    "
  >
    <Document
  file={pdfUrl}
  onLoadSuccess={handlePdfLoadSuccess}
  options={documentOptions}
  loading={
    <div className="min-h-[300px] flex items-center justify-center text-gray-500">
      Loading PowerPoint preview...
    </div>
  }
  error={
    <div className="min-h-[300px] flex items-center justify-center text-red-500">
      Failed to load PowerPoint preview.
    </div>
  }
>
      {/* MAIN SLIDE PREVIEW */}
      <div
  className="
    relative
    w-full
    h-[calc(100vh-380px)]
    min-h-[350px]
    bg-gray-100
    rounded-xl
    border
    border-gray-200
    overflow-auto
    shadow-sm
  "
>
  <div className="min-w-max min-h-max flex justify-center p-4">
    {numPages > 0 && (
      <Page
        pageNumber={safeCurrentPage + 1}
        width={900}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    )}
  </div>
</div>

      {numPages > 0 && (
        <>
        {/* THUMBNAILS */}
<div className="mt-2">
  <div className="flex gap-2 overflow-x-auto pb-1">
              {Array.from({ length: numPages }, (_, index) => {
  const shouldRenderThumbnail =
    Math.abs(index - safeCurrentPage) <= 3;

  return (
    <button
      key={index}
      type="button"
      onClick={() => setCurrentSlide(index)}
      className="flex-shrink-0 rounded-lg border-2 overflow-hidden"
    >
      {shouldRenderThumbnail ? (
        <Page
          pageNumber={index + 1}
          width={110}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      ) : (
        <div className="w-[110px] h-[62px] bg-gray-100 flex items-center justify-center text-xs">
          Slide {index + 1}
        </div>
      )}

      <div className="py-1 text-xs text-center bg-white text-gray-600">
        {index + 1}
      </div>
    </button>
  );
})}
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="flex items-center justify-between mt-3 pb-3">
            <button
              type="button"
              onClick={() =>
                setCurrentSlide((prev) =>
                  Math.max(prev - 1, 0)
                )
              }
              disabled={safeCurrentPage === 0}
              className="
                px-4
                py-2
                rounded-lg
                border
                border-gray-200
                text-sm
                transition
                hover:bg-gray-50
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
            >
              ← Previous
            </button>

            <span className="text-sm font-medium">
              Slide {safeCurrentPage + 1} / {numPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setCurrentSlide((prev) =>
                  Math.min(prev + 1, numPages - 1)
                )
              }
              disabled={safeCurrentPage === numPages - 1}
              className="
                px-4
                py-2
                rounded-lg
                border
                border-gray-200
                text-sm
                transition
                hover:bg-gray-50
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
            >
              Next →
            </button>
          </div>
        </>
      )}
    </Document>
  </div>
);
}