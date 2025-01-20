import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import useToggle from '@/app/hooks/useToggle.hook';

type VoucherAiPopoverFileTesseractProps = {
  ocr: "google-vision" | "tesseract";
  loadingTesseract: boolean;
  onScanByTesseract: (ocr: "google-vision" | "tesseract", model: "groq" | "together" | "gemini") => void;
};

const VoucherAiPopoverFileTesseract = ({
  ocr,
  loadingTesseract,
  onScanByTesseract,
}: VoucherAiPopoverFileTesseractProps) => {
  const togglePopover = useToggle(false);
  const onScan = async (variant: "google-vision" | "tesseract" , model: "groq" | "together" | "gemini") => {
    onScanByTesseract(variant, model);
    togglePopover.onClose();  
  }

  return (
    <Popover open={togglePopover.isOpen} onOpenChange={togglePopover.onToggle}>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                size="default"
                className="bg-background hover:bg-buttonText text-black hover:text-white font-medium py-2 px-4 rounded-lg"
              >
                {loadingTesseract && ocr === "tesseract" ? (
                  <Icon
                    remixIconClass="ri-loader-line"
                    size="md"
                    color="white"
                    className="animate-spin"
                  />
                ) : (
                  <Icon
                    remixIconClass="ri-qr-scan-line"
                    size="md"
                    color="white"
                  />
                )}
                <span>Tesseract</span>
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent
            sideOffset={5}
            className="border bg-white text-xs font-normal text-gray-500 shadow-xl"
          >
            <p className="text-sm">Select Tesseract Scan</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent className="w-full flex flex-row gap-2 h-auto z-50">
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => onScan("tesseract", "gemini")}
        >
          <Icon remixIconClass="ri-sparkling-fill" />
          <span>Gemini</span>
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => onScan("tesseract", "together")}
        >
          <Icon remixIconClass="ri-sparkling-fill" />
          <span>Together</span>
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => onScan("tesseract", "groq")}
        >
          <Icon remixIconClass="ri-sparkling-fill" />
          <span>Groq</span>
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default VoucherAiPopoverFileTesseract;
