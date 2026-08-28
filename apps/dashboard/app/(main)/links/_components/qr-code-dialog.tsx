"use client";

import type { Link } from "@/hooks/use-links";
import { LinkQrCode } from "./link-qr-code";
import { Dialog } from "@datamate/ui/client";

interface QrCodeDialogProps {
	link: Link | null;
	onOpenChange: (open: boolean) => void;
	open: boolean;
}

export function QrCodeDialog({ link, open, onOpenChange }: QrCodeDialogProps) {
	if (!link) {
		return null;
	}

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<Dialog.Content className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
				<Dialog.Header>
					<Dialog.Title className="text-center">{link.name}</Dialog.Title>
					<Dialog.Description className="text-center">
						Customize and download your QR code
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Body>
					<LinkQrCode name={link.name} slug={link.slug} />
				</Dialog.Body>
			</Dialog.Content>
		</Dialog>
	);
}
