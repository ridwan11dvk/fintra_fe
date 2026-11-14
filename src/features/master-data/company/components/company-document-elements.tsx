import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@railfinance/core/ui/card";
import { Label } from "@railfinance/core/ui/label";
import { FileUp, Trash2, X } from "lucide-react";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

interface DocumentFile {
  file: File;
  preview: string;
}

export interface CompanyDocumentElementsRef {
  getFiles: () => {
    logo: File | null;
    header: File | null;
    footer: File | null;
  };
}

interface CompanyDocumentElementsProps {
  isLoading?: boolean;
}

export const CompanyDocumentElements = forwardRef<
  CompanyDocumentElementsRef,
  CompanyDocumentElementsProps
>(({ isLoading = false }, ref) => {
  const [logoDoc, setLogoDoc] = useState<DocumentFile | null>(null);
  const [headerDoc, setHeaderDoc] = useState<DocumentFile | null>(null);
  const [footerDoc, setFooterDoc] = useState<DocumentFile | null>(null);
  const [error, setError] = useState<string>("");

  const logoInputRef = useRef<HTMLInputElement>(null);
  const headerInputRef = useRef<HTMLInputElement>(null);
  const footerInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  useImperativeHandle(ref, () => ({
    getFiles: () => ({
      logo: logoDoc?.file || null,
      header: headerDoc?.file || null,
      footer: footerDoc?.file || null,
    }),
  }));

  const validateAndPreview = async (file: File): Promise<string | null> => {
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds 10MB limit. File: ${file.name}`);
      return null;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setError("");
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect =
    (setter: (doc: DocumentFile | null) => void) =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const preview = await validateAndPreview(file);
      if (preview) {
        setter({ file, preview });
      }
    };

  const handleRemoveFile = (
    setter: (doc: DocumentFile | null) => void,
    inputRef: React.RefObject<HTMLInputElement | null>,
  ) => {
    setter(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Document Elements</CardTitle>
        <CardDescription>
          Attach company document elements (logo, header and footer)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Logo Upload */}
        <div className="space-y-3 mb-6">
          <Label>Company Logo</Label>
          <div className="space-y-2">
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect(setLogoDoc)}
              disabled={isLoading}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              disabled={isLoading}
              className="w-full px-4 py-2 border-2 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              <FileUp className="w-4 h-4" />
              {logoDoc ? "Change Logo" : "Upload Logo"}
            </button>
            {logoDoc && (
              <p className="text-xs text-gray-600">
                Selected: {logoDoc.file.name}
              </p>
            )}
            {logoDoc?.preview && (
              <div className="relative w-full h-40 border rounded overflow-hidden">
                <img
                  src={logoDoc.preview}
                  alt="Logo preview"
                  className="w-full h-full object-contain"
                />
                {!isLoading && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(setLogoDoc, logoInputRef)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Header Upload */}
        <div className="space-y-3 mb-6">
          <Label>Header</Label>
          <div className="space-y-2">
            <input
              ref={headerInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect(setHeaderDoc)}
              disabled={isLoading}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => headerInputRef.current?.click()}
              disabled={isLoading}
              className="w-full px-4 py-2 border-2 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              <FileUp className="w-4 h-4" />
              {headerDoc
                ? `${headerDoc.file.name} (Click to change)`
                : "Upload Header"}
            </button>
            {headerDoc && !headerDoc.preview && (
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600">
                  Selected: {headerDoc.file.name}
                </p>
                {!isLoading && (
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveFile(setHeaderDoc, headerInputRef)
                    }
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Remove
                  </button>
                )}
              </div>
            )}
            {headerDoc?.preview && (
              <div className="relative w-full h-40 border rounded overflow-hidden">
                <img
                  src={headerDoc.preview}
                  alt="Header preview"
                  className="w-full h-full object-contain"
                />
                {!isLoading && (
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveFile(setHeaderDoc, headerInputRef)
                    }
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Upload */}
        <div className="space-y-3 mb-6">
          <Label>Footer</Label>
          <div className="space-y-2">
            <input
              ref={footerInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect(setFooterDoc)}
              disabled={isLoading}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => footerInputRef.current?.click()}
              disabled={isLoading}
              className="w-full px-4 py-2 border-2 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              <FileUp className="w-4 h-4" />
              {footerDoc
                ? `${footerDoc.file.name} (Click to change)`
                : "Upload Footer"}
            </button>
            {footerDoc && !footerDoc.preview && (
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600">
                  Selected: {footerDoc.file.name}
                </p>
                {!isLoading && (
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveFile(setFooterDoc, footerInputRef)
                    }
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Remove
                  </button>
                )}
              </div>
            )}
            {footerDoc?.preview && (
              <div className="relative w-full h-40 border rounded overflow-hidden">
                <img
                  src={footerDoc.preview}
                  alt="Footer preview"
                  className="w-full h-full object-contain"
                />
                {!isLoading && (
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveFile(setFooterDoc, footerInputRef)
                    }
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

CompanyDocumentElements.displayName = "CompanyDocumentElements";
