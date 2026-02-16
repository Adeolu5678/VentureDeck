import { action, mutation, internalAction } from './_generated/server';
import { v } from 'convex/values';

/**
 * File storage functions for handling file uploads and management.
 * Provides secure access to Convex's file storage system.
 */

// ============================================================================
// FILE VALIDATION CONFIGURATION
// ============================================================================

export const FILE_VALIDATION_CONFIG = {
  allowedImageTypes: {
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] as string[],
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as string[],
    maxSizeBytes: 10 * 1024 * 1024,
    magicNumbers: {
      'image/jpeg': [[0xff, 0xd8, 0xff]],
      'image/png': [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
      'image/gif': [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61], [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]],
      'image/webp': [[0x52, 0x49, 0x46, 0x46]],
    },
  },
  allowedDocumentTypes: {
    extensions: ['pdf', 'doc', 'docx'] as string[],
    mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] as string[],
    maxSizeBytes: 25 * 1024 * 1024,
    magicNumbers: {
      'application/pdf': [[0x25, 0x50, 0x44, 0x46]],
      'application/msword': [[0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [[0x50, 0x4b, 0x03, 0x04], [0x50, 0x4b, 0x05, 0x06], [0x50, 0x4b, 0x07, 0x08]],
    },
  },
  blockedExtensions: ['exe', 'bat', 'cmd', 'com', 'pif', 'scr', 'vbs', 'js', 'jar', 'msi', 'app', 'dmg', 'sh', 'bash', 'ps1', 'psm1', 'psd1'] as string[],
};

type FileCategory = 'image' | 'document';

interface FileValidationResult {
  valid: boolean;
  error?: string;
  category?: FileCategory;
}

function getExtension(filename: string): string {
  const parts = filename.toLowerCase().split('.');
  return parts.length > 1 ? parts.pop()! : '';
}

function getAllAllowedExtensions(): string[] {
  return [
    ...FILE_VALIDATION_CONFIG.allowedImageTypes.extensions,
    ...FILE_VALIDATION_CONFIG.allowedDocumentTypes.extensions,
  ];
}

function getAllAllowedMimeTypes(): string[] {
  return [
    ...FILE_VALIDATION_CONFIG.allowedImageTypes.mimeTypes,
    ...FILE_VALIDATION_CONFIG.allowedDocumentTypes.mimeTypes,
  ];
}

function validateFileType(filename: string, mimeType: string): FileValidationResult {
  const extension = getExtension(filename);

  if (FILE_VALIDATION_CONFIG.blockedExtensions.includes(extension)) {
    return { valid: false, error: `File type '${extension}' is blocked for security reasons` };
  }

  const allExtensions = getAllAllowedExtensions();
  if (!allExtensions.includes(extension)) {
    return { valid: false, error: `File extension '${extension}' is not allowed. Allowed: ${allExtensions.join(', ')}` };
  }

  const allMimeTypes = getAllAllowedMimeTypes();
  if (!allMimeTypes.includes(mimeType)) {
    return { valid: false, error: `MIME type '${mimeType}' is not allowed` };
  }

  let category: FileCategory | undefined;
  if (FILE_VALIDATION_CONFIG.allowedImageTypes.extensions.includes(extension)) {
    category = 'image';
  } else if (FILE_VALIDATION_CONFIG.allowedDocumentTypes.extensions.includes(extension)) {
    category = 'document';
  }

  return { valid: true, category };
}

function validateFileSize(sizeBytes: number, category: FileCategory): FileValidationResult {
  const maxSize = category === 'image'
    ? FILE_VALIDATION_CONFIG.allowedImageTypes.maxSizeBytes
    : FILE_VALIDATION_CONFIG.allowedDocumentTypes.maxSizeBytes;

  const maxMB = maxSize / (1024 * 1024);

  if (sizeBytes <= 0) {
    return { valid: false, error: 'File size must be greater than 0' };
  }

  if (sizeBytes > maxSize) {
    return { valid: false, error: `File size exceeds maximum allowed size of ${maxMB}MB for ${category}s` };
  }

  return { valid: true };
}

function getFileCategoryFromExtension(extension: string): FileCategory | null {
  if (FILE_VALIDATION_CONFIG.allowedImageTypes.extensions.includes(extension)) {
    return 'image';
  }
  if (FILE_VALIDATION_CONFIG.allowedDocumentTypes.extensions.includes(extension)) {
    return 'document';
  }
  return null;
}

function getAllowedMimeTypesForCategory(category: FileCategory): string[] {
  return category === 'image'
    ? [...FILE_VALIDATION_CONFIG.allowedImageTypes.mimeTypes]
    : [...FILE_VALIDATION_CONFIG.allowedDocumentTypes.mimeTypes];
}

function detectMimeTypeFromMagicNumbers(uint8Array: Uint8Array): string | null {
  const bytes = Array.from(uint8Array.slice(0, 16));

  const allMagicNumbers = {
    ...FILE_VALIDATION_CONFIG.allowedImageTypes.magicNumbers,
    ...FILE_VALIDATION_CONFIG.allowedDocumentTypes.magicNumbers,
  };

  for (const [mimeType, magicNumberPatterns] of Object.entries(allMagicNumbers)) {
    for (const pattern of magicNumberPatterns) {
      if (bytes.length >= pattern.length) {
        const matches = pattern.every((byte, index) => bytes[index] === byte);
        if (matches) {
          return mimeType;
        }
      }
    }
  }

  return null;
}

export const getUploadLimits = action({
  args: {},
  handler: async () => {
    return {
      imageMaxSizeMB: FILE_VALIDATION_CONFIG.allowedImageTypes.maxSizeBytes / (1024 * 1024),
      documentMaxSizeMB: FILE_VALIDATION_CONFIG.allowedDocumentTypes.maxSizeBytes / (1024 * 1024),
      allowedImageExtensions: FILE_VALIDATION_CONFIG.allowedImageTypes.extensions,
      allowedDocumentExtensions: FILE_VALIDATION_CONFIG.allowedDocumentTypes.extensions,
      allowedImageMimeTypes: FILE_VALIDATION_CONFIG.allowedImageTypes.mimeTypes,
      allowedDocumentMimeTypes: FILE_VALIDATION_CONFIG.allowedDocumentTypes.mimeTypes,
    };
  },
});

export const generateUploadUrl = action({
  args: {
    filename: v.string(),
    mimeType: v.string(),
    sizeBytes: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    const typeValidation = validateFileType(args.filename, args.mimeType);
    if (!typeValidation.valid) {
      throw new Error(typeValidation.error);
    }

    if (!typeValidation.category) {
      throw new Error('Could not determine file category');
    }

    const sizeValidation = validateFileSize(args.sizeBytes, typeValidation.category);
    if (!sizeValidation.valid) {
      throw new Error(sizeValidation.error);
    }

    const uploadUrl = await ctx.storage.generateUploadUrl();
    return {
      uploadUrl,
      validatedCategory: typeValidation.category,
      maxAllowedSize: typeValidation.category === 'image'
        ? FILE_VALIDATION_CONFIG.allowedImageTypes.maxSizeBytes
        : FILE_VALIDATION_CONFIG.allowedDocumentTypes.maxSizeBytes,
    };
  },
});

export const validateUploadedFile = internalAction({
  args: {
    storageId: v.string(),
    expectedMimeType: v.string(),
    expectedFilename: v.string(),
  },
  handler: async (ctx, args) => {
    const metadata = await ctx.storage.getMetadata(args.storageId);
    if (!metadata) {
      throw new Error('File not found in storage');
    }

    const storedContentType = metadata.contentType;
    const storedSize = metadata.size;

    const typeValidation = validateFileType(args.expectedFilename, args.expectedMimeType);
    if (!typeValidation.valid) {
      await ctx.storage.delete(args.storageId);
      throw new Error(typeValidation.error);
    }

    if (storedContentType && storedContentType !== args.expectedMimeType) {
      await ctx.storage.delete(args.storageId);
      throw new Error(`MIME type mismatch: expected ${args.expectedMimeType}, got ${storedContentType}`);
    }

    if (typeValidation.category && storedSize) {
      const sizeValidation = validateFileSize(storedSize, typeValidation.category);
      if (!sizeValidation.valid) {
        await ctx.storage.delete(args.storageId);
        throw new Error(sizeValidation.error);
      }
    }

    return {
      valid: true,
      storageId: args.storageId,
      category: typeValidation.category,
      actualSize: storedSize,
      actualMimeType: storedContentType,
    };
  },
});

export const validateFileContent = action({
  args: {
    storageId: v.string(),
    filename: v.string(),
    claimedMimeType: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    const blob = await ctx.storage.get(args.storageId);
    if (!blob) {
      throw new Error('File not found in storage');
    }

    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const detectedMimeType = detectMimeTypeFromMagicNumbers(uint8Array);

    if (!detectedMimeType) {
      return {
        valid: false,
        error: 'Could not verify file type from content. File may be corrupted or of unsupported type.',
        storageId: args.storageId,
      };
    }

    if (detectedMimeType !== args.claimedMimeType) {
      return {
        valid: false,
        error: `File content does not match claimed type. Claimed: ${args.claimedMimeType}, Detected: ${detectedMimeType}`,
        storageId: args.storageId,
        detectedMimeType,
      };
    }

    const extension = getExtension(args.filename);
    const category = getFileCategoryFromExtension(extension);
    const allowedMimes = category ? getAllowedMimeTypesForCategory(category) : [];

    if (category && !allowedMimes.includes(detectedMimeType)) {
      return {
        valid: false,
        error: `Detected file type ${detectedMimeType} is not allowed for category ${category}`,
        storageId: args.storageId,
        detectedMimeType,
      };
    }

    return {
      valid: true,
      storageId: args.storageId,
      detectedMimeType,
      category,
    };
  },
});

export const safeUploadAndValidate = action({
  args: {
    storageId: v.string(),
    filename: v.string(),
    mimeType: v.string(),
  },
  handler: async (ctx, args): Promise<{ storageId: string; category: FileCategory | null; mimeType: string | null; validated: boolean }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    const typeValidation = validateFileType(args.filename, args.mimeType);
    if (!typeValidation.valid) {
      try {
        await ctx.storage.delete(args.storageId);
      } catch {}
      throw new Error(typeValidation.error);
    }

    const blob = await ctx.storage.get(args.storageId);
    if (!blob) {
      try {
        await ctx.storage.delete(args.storageId);
      } catch {}
      throw new Error('File not found in storage');
    }

    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const detectedMimeType = detectMimeTypeFromMagicNumbers(uint8Array);

    if (!detectedMimeType) {
      try {
        await ctx.storage.delete(args.storageId);
      } catch {}
      throw new Error('Could not verify file type from content. File may be corrupted or of unsupported type.');
    }

    if (detectedMimeType !== args.mimeType) {
      try {
        await ctx.storage.delete(args.storageId);
      } catch {}
      throw new Error(`File content does not match claimed type. Claimed: ${args.mimeType}, Detected: ${detectedMimeType}`);
    }

    const extension = getExtension(args.filename);
    const category = getFileCategoryFromExtension(extension);
    const allowedMimes = category ? getAllowedMimeTypesForCategory(category) : [];

    if (category && !allowedMimes.includes(detectedMimeType)) {
      try {
        await ctx.storage.delete(args.storageId);
      } catch {}
      throw new Error(`Detected file type ${detectedMimeType} is not allowed for category ${category}`);
    }

    return {
      storageId: args.storageId,
      category,
      mimeType: detectedMimeType,
      validated: true,
    };
  },
});

/**
 * Gets the public URL for a stored file.
 * @param storageId - The storage ID of the file
 * @returns The public URL string
 */
export const getUrl = action({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const url = await ctx.storage.getUrl(args.storageId);
      return url;
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw new Error('Failed to get file URL');
    }
  },
});

/**
 * Deletes a stored file from Convex storage.
 * Verifies ownership before allowing deletion.
 * @param storageId - The storage ID of the file to delete
 */
export const deleteFile = mutation({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .first();

    if (!user) throw new Error('User not found');

    const legalDoc = await ctx.db
      .query('legalDocs')
      .filter((q) => q.eq(q.field('storageId'), args.storageId))
      .first();

    if (legalDoc) {
      const project = await ctx.db.get(legalDoc.projectId);
      if (!project) throw new Error('Project not found');
      if (project.ownerId !== user._id) {
        throw new Error('Only project owner can delete this file');
      }
      await ctx.storage.delete(args.storageId);
      return;
    }

    const dataRoomDoc = await ctx.db
      .query('dataRoomDocuments')
      .filter((q) => q.eq(q.field('storageId'), args.storageId))
      .first();

    if (dataRoomDoc) {
      if (dataRoomDoc.uploadedBy !== user._id) {
        const dataRoom = await ctx.db.get(dataRoomDoc.dataRoomId);
        if (!dataRoom) throw new Error('Data room not found');
        const project = await ctx.db.get(dataRoom.projectId);
        if (!project) throw new Error('Project not found');
        if (project.ownerId !== user._id) {
          throw new Error('Only the uploader or project owner can delete this file');
        }
      }
      await ctx.storage.delete(args.storageId);
      return;
    }

    throw new Error('File not found or access denied');
  },
});