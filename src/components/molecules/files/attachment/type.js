/**
 * Get the file type.
 *
 * @param {object} file - The file to check.
 * @returns {string} - The file type.
 */
export const getFileType = (file) =>
{
	let category = 'file';

	if (!file)
	{
		return category;
	}

	// Normalize MIME
	const mime = (file.type || '').toLowerCase();

	// broad buckets
	if (mime.startsWith('image/'))
	{
		return 'image';
	}

	if (mime.startsWith('video/'))
	{
		return 'video';
	}

	if (mime.startsWith('audio/'))
	{
		return 'audio';
	}

	// specific MIME lookups
	switch (mime)
	{
		case 'application/pdf':
			return 'pdf';

		// word‐processing
		case 'application/msword':
		case 'application/rtf':
		case 'application/vnd.oasis.opendocument.text':
		case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
			return 'document';

		// spreadsheets
		case 'application/vnd.ms-excel':
		case 'application/vnd.oasis.opendocument.spreadsheet':
		case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
			return 'spreadsheet';

		// presentations
		case 'application/vnd.ms-powerpoint':
		case 'application/vnd.oasis.opendocument.presentation':
		case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
			return 'presentation';

		// archives
		case 'application/zip':
		case 'application/x-7z-compressed':
		case 'application/x-rar-compressed':
		case 'application/x-tar':
		case 'application/gzip':
		case 'application/x-bzip2':
			return 'archive';

		// text types
		case 'text/plain':
		case 'text/html':
		case 'text/csv':
		case 'text/markdown':
			return 'text';

		// JSON
		case 'application/json':
			return 'json';
	}

	// fallback to extension if MIME was empty or unrecognized
	if (file.name && file.name.includes('.'))
	{
		const ext = file.name.split('.').pop().toLowerCase();

		switch (ext)
		{
			case 'jpg':
			case 'jpeg':
			case 'png':
			case 'gif':
			case 'bmp':
			case 'webp':
				return 'image';

			case 'mp4':
			case 'mov':
			case 'avi':
			case 'mkv':
				return 'video';

			case 'mp3':
			case 'wav':
			case 'ogg':
			case 'flac':
				return 'audio';

			case 'pdf':
				return 'pdf';

			case 'doc':
			case 'docx':
			case 'odt':
			case 'rtf':
				return 'document';

			case 'xls':
			case 'xlsx':
			case 'ods':
				return 'spreadsheet';

			case 'ppt':
			case 'pptx':
			case 'odp':
				return 'presentation';

			case 'zip':
			case 'rar':
			case '7z':
			case 'tar':
			case 'gz':
			case 'bz2':
				return 'archive';

			case 'txt':
			case 'csv':
			case 'md':
				return 'text';

			case 'json':
				return 'json';
		}
	}

	return category;
};