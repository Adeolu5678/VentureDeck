/// VentureDeck Mobile - Legal Documents Screen
///
/// Screen for viewing and managing legal documents.
library;

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:venturedeck_mobile/core/theme/app_theme.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_button.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_card.dart';

/// Legal document type
enum LegalDocType {
  nda(
    'Non-Disclosure Agreement',
    Icons.lock_outline,
    'Protect sensitive information shared during discussions',
  ),
  term(
    'Term Sheet',
    Icons.description,
    'Outline key terms and conditions of investment',
  ),
  safe(
    'SAFE Agreement',
    Icons.shield_outlined,
    'Simple Agreement for Future Equity',
  ),
  convertible(
    'Convertible Note',
    Icons.transform,
    'Debt that converts to equity',
  ),
  subscription(
    'Subscription Agreement',
    Icons.drive_file_rename_outline,
    'Investment subscription terms',
  ),
  shareholder(
    'Shareholders Agreement',
    Icons.people_outline,
    'Rights and obligations of shareholders',
  );

  const LegalDocType(this.title, this.icon, this.description);
  final String title;
  final IconData icon;
  final String description;
}

/// Legal documents screen
class LegalDocumentsScreen extends ConsumerStatefulWidget {
  const LegalDocumentsScreen({super.key, required this.projectId});

  final String projectId;

  @override
  ConsumerState<LegalDocumentsScreen> createState() =>
      _LegalDocumentsScreenState();
}

class _LegalDocumentsScreenState extends ConsumerState<LegalDocumentsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Mock data for documents
  final List<_LegalDocument> _documents = [
    _LegalDocument(
      id: '1',
      type: LegalDocType.nda,
      title: 'Mutual NDA - VentureDeck',
      status: _DocStatus.signed,
      createdAt: DateTime.now().subtract(const Duration(days: 30)),
    ),
    _LegalDocument(
      id: '2',
      type: LegalDocType.term,
      title: 'Series A Term Sheet',
      status: _DocStatus.pending,
      createdAt: DateTime.now().subtract(const Duration(days: 5)),
    ),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.backgroundGradient),
        child: SafeArea(
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(AppSpacing.lg),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.arrow_back),
                      onPressed: () => context.pop(),
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    Text(
                      'Legal Documents',
                      style: AppTypography.headlineMedium.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),

              // Tabs
              Container(
                margin: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                decoration: const BoxDecoration(
                  color: AppColors.backgroundCard,
                  borderRadius: AppRadius.radiusMd,
                ),
                child: TabBar(
                  controller: _tabController,
                  indicatorSize: TabBarIndicatorSize.tab,
                  dividerColor: Colors.transparent,
                  indicator: const BoxDecoration(
                    gradient: AppColors.primaryGradient,
                    borderRadius: AppRadius.radiusMd,
                  ),
                  labelColor: AppColors.backgroundDark,
                  unselectedLabelColor: AppColors.textSecondary,
                  tabs: const [
                    Tab(text: 'My Documents'),
                    Tab(text: 'Templates'),
                  ],
                ),
              ),

              const SizedBox(height: AppSpacing.lg),

              // Content
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    _DocumentsList(documents: _documents),
                    const _TemplatesList(),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showCreateDocumentDialog(context),
        backgroundColor: AppColors.primary,
        icon: const Icon(Icons.add, color: AppColors.backgroundDark),
        label: Text(
          'New Document',
          style: AppTypography.labelMedium.copyWith(
            color: AppColors.backgroundDark,
          ),
        ),
      ),
    );
  }

  void _showCreateDocumentDialog(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.backgroundCard,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: const BoxDecoration(
                  color: AppColors.textMuted,
                  borderRadius: AppRadius.radiusFull,
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.lg),
            Text('Create Document', style: AppTypography.titleMedium),
            const SizedBox(height: AppSpacing.md),
            Text(
              'Select a template to create a new document',
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.textMuted,
              ),
            ),
            const SizedBox(height: AppSpacing.lg),
            ...LegalDocType.values.map(
              (type) => ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.1),
                    borderRadius: AppRadius.radiusMd,
                  ),
                  child: Icon(type.icon, color: AppColors.primary, size: 20),
                ),
                title: Text(type.title, style: AppTypography.bodyMedium),
                trailing: const Icon(
                  Icons.chevron_right,
                  color: AppColors.textMuted,
                ),
                onTap: () {
                  Navigator.pop(ctx);
                  _showDocumentCreatedSnackBar(type);
                },
              ),
            ),
            const SizedBox(height: AppSpacing.lg),
          ],
        ),
      ),
    );
  }

  void _showDocumentCreatedSnackBar(LegalDocType type) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${type.title} created successfully'),
        backgroundColor: AppColors.success,
      ),
    );
  }
}

/// Documents list
class _DocumentsList extends StatelessWidget {
  const _DocumentsList({required this.documents});

  final List<_LegalDocument> documents;

  @override
  Widget build(BuildContext context) {
    if (documents.isEmpty) {
      return _buildEmptyState();
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
      itemCount: documents.length,
      itemBuilder: (context, index) {
        return Padding(
          padding: const EdgeInsets.only(bottom: AppSpacing.md),
          child: _DocumentCard(document: documents[index])
              .animate(delay: Duration(milliseconds: 50 * index))
              .fadeIn()
              .slideX(begin: -0.1),
        );
      },
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: AppColors.primary.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.folder_open,
                size: 40,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(height: AppSpacing.lg),
            Text('No documents yet', style: AppTypography.titleMedium),
            const SizedBox(height: AppSpacing.sm),
            Text(
              'Create your first legal document',
              style: AppTypography.bodyMedium.copyWith(
                color: AppColors.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Document card
class _DocumentCard extends StatelessWidget {
  const _DocumentCard({required this.document});

  final _LegalDocument document;

  @override
  Widget build(BuildContext context) {
    return PremiumCard(
      onTap: () => _showDocumentViewer(context),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.1),
                  borderRadius: AppRadius.radiusMd,
                ),
                child: Icon(
                  document.type.icon,
                  color: AppColors.primary,
                  size: 20,
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      document.title,
                      style: AppTypography.titleSmall.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      document.type.title,
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.textMuted,
                      ),
                    ),
                  ],
                ),
              ),
              _StatusBadge(status: document.status),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Created ${_formatDate(document.createdAt)}',
                style: AppTypography.labelSmall.copyWith(
                  color: AppColors.textMuted,
                ),
              ),
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.share_outlined, size: 20),
                    onPressed: () {},
                    constraints: const BoxConstraints(),
                    padding: EdgeInsets.zero,
                  ),
                  const SizedBox(width: AppSpacing.md),
                  IconButton(
                    icon: const Icon(Icons.download_outlined, size: 20),
                    onPressed: () {},
                    constraints: const BoxConstraints(),
                    padding: EdgeInsets.zero,
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    final months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return '${months[date.month - 1]} ${date.day}, ${date.year}';
  }

  void _showDocumentViewer(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.backgroundCard,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.9,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        expand: false,
        builder: (_, scrollController) => Column(
          children: [
            // Handle
            Container(
              margin: const EdgeInsets.only(top: AppSpacing.md),
              width: 40,
              height: 4,
              decoration: const BoxDecoration(
                color: AppColors.textMuted,
                borderRadius: AppRadius.radiusFull,
              ),
            ),

            // Header
            Padding(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(document.title, style: AppTypography.titleMedium),
                        Text(
                          document.type.title,
                          style: AppTypography.labelSmall.copyWith(
                            color: AppColors.textMuted,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
            ),

            const Divider(color: AppColors.border),

            // Content placeholder
            Expanded(
              child: SingleChildScrollView(
                controller: scrollController,
                padding: const EdgeInsets.all(AppSpacing.lg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Document Preview',
                      style: AppTypography.headlineSmall,
                    ),
                    const SizedBox(height: AppSpacing.lg),
                    Container(
                      padding: const EdgeInsets.all(AppSpacing.lg),
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        borderRadius: AppRadius.radiusMd,
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            document.type.title.toUpperCase(),
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.black,
                            ),
                          ),
                          const SizedBox(height: 16),
                          const Text(
                            'This document serves as a legal agreement between the parties involved...',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.black87,
                              height: 1.6,
                            ),
                          ),
                          const SizedBox(height: 16),
                          const Text(
                            '1. DEFINITIONS AND INTERPRETATION\n\nIn this Agreement, unless the context otherwise requires, the following terms shall have the meanings set out below...',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.black87,
                              height: 1.6,
                            ),
                          ),
                          const SizedBox(height: 16),
                          const Text(
                            '2. CONFIDENTIAL INFORMATION\n\nEach party agrees to maintain in confidence all Confidential Information disclosed by the other party...',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.black87,
                              height: 1.6,
                            ),
                          ),
                          const SizedBox(height: 24),
                          Center(
                            child: Text(
                              '[Document continues...]',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey[600],
                                fontStyle: FontStyle.italic,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Actions
            Container(
              padding: const EdgeInsets.all(AppSpacing.lg),
              decoration: const BoxDecoration(
                color: AppColors.backgroundCard,
                border: Border(top: BorderSide(color: AppColors.border)),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: PremiumButton(
                      label: 'Download PDF',
                      icon: Icons.download,
                      variant: PremiumButtonVariant.outline,
                      onPressed: () {
                        Navigator.pop(ctx);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Downloading...')),
                        );
                      },
                    ),
                  ),
                  if (document.status == _DocStatus.pending) ...[
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: PremiumButton(
                        label: 'Sign Document',
                        icon: Icons.edit,
                        variant: PremiumButtonVariant.gradient,
                        onPressed: () {
                          Navigator.pop(ctx);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Document signed!')),
                          );
                        },
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Templates list
class _TemplatesList extends StatelessWidget {
  const _TemplatesList();

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
      itemCount: LegalDocType.values.length,
      itemBuilder: (context, index) {
        final type = LegalDocType.values[index];
        return Padding(
          padding: const EdgeInsets.only(bottom: AppSpacing.md),
          child: _TemplateCard(type: type)
              .animate(delay: Duration(milliseconds: 50 * index))
              .fadeIn()
              .slideX(begin: -0.1),
        );
      },
    );
  }
}

/// Template card
class _TemplateCard extends StatelessWidget {
  const _TemplateCard({required this.type});

  final LegalDocType type;

  @override
  Widget build(BuildContext context) {
    return PremiumCard(
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.1),
              borderRadius: AppRadius.radiusMd,
            ),
            child: Icon(type.icon, color: AppColors.primary, size: 24),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  type.title,
                  style: AppTypography.titleSmall.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  type.description,
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.textMuted,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          const SizedBox(width: AppSpacing.sm),
          PremiumButton(
            label: 'Use',
            size: PremiumButtonSize.small,
            variant: PremiumButtonVariant.glass,
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Creating ${type.title}...')),
              );
            },
          ),
        ],
      ),
    );
  }
}

/// Status badge
class _StatusBadge extends StatelessWidget {
  const _StatusBadge({required this.status});

  final _DocStatus status;

  @override
  Widget build(BuildContext context) {
    final (color, text) = switch (status) {
      _DocStatus.draft => (AppColors.textMuted, 'Draft'),
      _DocStatus.pending => (Colors.orange, 'Pending'),
      _DocStatus.signed => (AppColors.success, 'Signed'),
      _DocStatus.expired => (AppColors.error, 'Expired'),
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: AppRadius.radiusSm,
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Text(
        text,
        style: AppTypography.labelSmall.copyWith(
          color: color,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

// Helper models

enum _DocStatus { draft, pending, signed, expired }

class _LegalDocument {
  const _LegalDocument({
    required this.id,
    required this.type,
    required this.title,
    required this.status,
    required this.createdAt,
  });

  final String id;
  final LegalDocType type;
  final String title;
  final _DocStatus status;
  final DateTime createdAt;
}
