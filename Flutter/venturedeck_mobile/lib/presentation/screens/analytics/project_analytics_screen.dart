/// VentureDeck Mobile - Project Analytics Screen
///
/// Analytics dashboard for project owners with charts.
library;

import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:venturedeck_mobile/core/theme/app_theme.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_card.dart';

/// Analytics screen for project owners
class ProjectAnalyticsScreen extends ConsumerStatefulWidget {
  const ProjectAnalyticsScreen({super.key, required this.projectId});

  final String projectId;

  @override
  ConsumerState<ProjectAnalyticsScreen> createState() =>
      _ProjectAnalyticsScreenState();
}

class _ProjectAnalyticsScreenState
    extends ConsumerState<ProjectAnalyticsScreen> {
  int _selectedPeriod = 0;
  final List<String> _periods = ['7D', '30D', '90D', 'All'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.backgroundGradient),
        child: SafeArea(
          child: CustomScrollView(
            slivers: [
              // Header
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  child: Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back),
                        onPressed: () => context.pop(),
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      Text(
                        'Analytics',
                        style: AppTypography.headlineMedium.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Time period selector
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.lg,
                  ),
                  child: Row(
                    children: _periods.asMap().entries.map((entry) {
                      final index = entry.key;
                      final label = entry.value;
                      return _PeriodChip(
                        label: label,
                        isSelected: _selectedPeriod == index,
                        onTap: () => setState(() => _selectedPeriod = index),
                      );
                    }).toList(),
                  ).animate().fadeIn(),
                ),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.lg)),

              // Key metrics
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.lg,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Overview', style: AppTypography.titleMedium),
                      const SizedBox(height: AppSpacing.md),
                      const Row(
                        children: [
                          Expanded(
                            child: _MetricCard(
                              title: 'Profile Views',
                              value: '1,247',
                              change: '+12%',
                              isPositive: true,
                              icon: Icons.visibility,
                            ),
                          ),
                          SizedBox(width: AppSpacing.md),
                          Expanded(
                            child: _MetricCard(
                              title: 'Followers',
                              value: '89',
                              change: '+8',
                              isPositive: true,
                              icon: Icons.people,
                            ),
                          ),
                        ],
                      ).animate(delay: 100.ms).fadeIn().slideY(begin: 0.1),
                      const SizedBox(height: AppSpacing.md),
                      const Row(
                        children: [
                          Expanded(
                            child: _MetricCard(
                              title: 'Applications',
                              value: '23',
                              change: '+5',
                              isPositive: true,
                              icon: Icons.assignment,
                            ),
                          ),
                          SizedBox(width: AppSpacing.md),
                          Expanded(
                            child: _MetricCard(
                              title: 'Messages',
                              value: '156',
                              change: '+34',
                              isPositive: true,
                              icon: Icons.chat_bubble,
                            ),
                          ),
                        ],
                      ).animate(delay: 150.ms).fadeIn().slideY(begin: 0.1),
                    ],
                  ),
                ),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.xl)),

              // Engagement Chart
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.lg,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Engagement Trend',
                        style: AppTypography.titleMedium,
                      ),
                      const SizedBox(height: AppSpacing.md),
                      PremiumCard(
                        child: SizedBox(height: 200, child: _EngagementChart()),
                      ).animate(delay: 200.ms).fadeIn().slideY(begin: 0.1),
                    ],
                  ),
                ),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.xl)),

              // Traction Score
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.lg,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Traction Score', style: AppTypography.titleMedium),
                      const SizedBox(height: AppSpacing.md),
                      PremiumCard(
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      '72',
                                      style: AppTypography.displayMedium
                                          .copyWith(
                                            color: AppColors.primary,
                                            fontWeight: FontWeight.bold,
                                          ),
                                    ),
                                    Text(
                                      'Current Score',
                                      style: AppTypography.bodySmall.copyWith(
                                        color: AppColors.textMuted,
                                      ),
                                    ),
                                  ],
                                ),
                                SizedBox(
                                  width: 100,
                                  height: 100,
                                  child: _TractionDonutChart(),
                                ),
                              ],
                            ),
                            const SizedBox(height: AppSpacing.lg),
                            // Score breakdown
                            const _ScoreBreakdownItem(
                              label: 'Profile Completeness',
                              value: 90,
                              maxValue: 100,
                            ),
                            const SizedBox(height: AppSpacing.md),
                            const _ScoreBreakdownItem(
                              label: 'Milestone Progress',
                              value: 60,
                              maxValue: 100,
                            ),
                            const SizedBox(height: AppSpacing.md),
                            const _ScoreBreakdownItem(
                              label: 'Engagement',
                              value: 75,
                              maxValue: 100,
                            ),
                            const SizedBox(height: AppSpacing.md),
                            const _ScoreBreakdownItem(
                              label: 'Team Activity',
                              value: 65,
                              maxValue: 100,
                            ),
                          ],
                        ),
                      ).animate(delay: 250.ms).fadeIn().slideY(begin: 0.1),
                    ],
                  ),
                ),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.xl)),

              // Traffic Sources
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.lg,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Traffic Sources', style: AppTypography.titleMedium),
                      const SizedBox(height: AppSpacing.md),
                      PremiumCard(
                        child: Row(
                          children: [
                            SizedBox(
                              width: 120,
                              height: 120,
                              child: _TrafficPieChart(),
                            ),
                            const SizedBox(width: AppSpacing.lg),
                            const Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  _LegendItem(
                                    color: AppColors.primary,
                                    label: 'Direct',
                                    value: '45%',
                                  ),
                                  SizedBox(height: AppSpacing.sm),
                                  _LegendItem(
                                    color: Colors.blue,
                                    label: 'Discover',
                                    value: '30%',
                                  ),
                                  SizedBox(height: AppSpacing.sm),
                                  _LegendItem(
                                    color: Colors.purple,
                                    label: 'Referral',
                                    value: '15%',
                                  ),
                                  SizedBox(height: AppSpacing.sm),
                                  _LegendItem(
                                    color: Colors.teal,
                                    label: 'Other',
                                    value: '10%',
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ).animate(delay: 300.ms).fadeIn().slideY(begin: 0.1),
                    ],
                  ),
                ),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.xl)),

              // Recent activity
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.lg,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Recent Activity', style: AppTypography.titleMedium),
                      const SizedBox(height: AppSpacing.md),
                      const PremiumCard(
                        padding: EdgeInsets.zero,
                        child: Column(
                          children: [
                            _ActivityItem(
                              icon: Icons.person_add,
                              title: 'New follower',
                              subtitle: '2 hours ago',
                              iconColor: AppColors.success,
                            ),
                            Divider(color: AppColors.border, height: 1),
                            _ActivityItem(
                              icon: Icons.visibility,
                              title: '15 new profile views',
                              subtitle: 'Today',
                              iconColor: Colors.blue,
                            ),
                            Divider(color: AppColors.border, height: 1),
                            _ActivityItem(
                              icon: Icons.chat_bubble,
                              title: 'New message from investor',
                              subtitle: 'Yesterday',
                              iconColor: AppColors.primary,
                            ),
                            Divider(color: AppColors.border, height: 1),
                            _ActivityItem(
                              icon: Icons.assignment,
                              title: 'New application received',
                              subtitle: '2 days ago',
                              iconColor: Colors.purple,
                            ),
                          ],
                        ),
                      ).animate(delay: 350.ms).fadeIn().slideY(begin: 0.1),
                    ],
                  ),
                ),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: 100)),
            ],
          ),
        ),
      ),
    );
  }
}

/// Engagement line chart
class _EngagementChart extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return LineChart(
      LineChartData(
        gridData: FlGridData(
          show: true,
          drawVerticalLine: false,
          horizontalInterval: 50,
          getDrawingHorizontalLine: (value) => FlLine(
            color: AppColors.border.withValues(alpha: 0.3),
            strokeWidth: 1,
          ),
        ),
        titlesData: FlTitlesData(
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 30,
              interval: 1,
              getTitlesWidget: (value, meta) {
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                if (value.toInt() < days.length) {
                  return Padding(
                    padding: const EdgeInsets.only(top: 8),
                    child: Text(
                      days[value.toInt()],
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.textMuted,
                      ),
                    ),
                  );
                }
                return const SizedBox.shrink();
              },
            ),
          ),
          leftTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 35,
              interval: 50,
              getTitlesWidget: (value, meta) => Text(
                value.toInt().toString(),
                style: AppTypography.labelSmall.copyWith(
                  color: AppColors.textMuted,
                ),
              ),
            ),
          ),
          topTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          rightTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
        ),
        borderData: FlBorderData(show: false),
        minX: 0,
        maxX: 6,
        minY: 0,
        maxY: 200,
        lineBarsData: [
          LineChartBarData(
            spots: const [
              FlSpot(0, 120),
              FlSpot(1, 150),
              FlSpot(2, 130),
              FlSpot(3, 180),
              FlSpot(4, 160),
              FlSpot(5, 175),
              FlSpot(6, 190),
            ],
            isCurved: true,
            color: AppColors.primary,
            barWidth: 3,
            isStrokeCapRound: true,
            dotData: const FlDotData(show: false),
            belowBarData: BarAreaData(
              show: true,
              color: AppColors.primary.withValues(alpha: 0.1),
            ),
          ),
        ],
      ),
    );
  }
}

/// Traction score donut chart
class _TractionDonutChart extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return PieChart(
      PieChartData(
        sectionsSpace: 0,
        centerSpaceRadius: 30,
        sections: [
          PieChartSectionData(
            value: 72,
            color: AppColors.primary,
            radius: 15,
            showTitle: false,
          ),
          PieChartSectionData(
            value: 28,
            color: AppColors.backgroundCardLight,
            radius: 15,
            showTitle: false,
          ),
        ],
      ),
    );
  }
}

/// Traffic sources pie chart
class _TrafficPieChart extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return PieChart(
      PieChartData(
        sectionsSpace: 2,
        centerSpaceRadius: 0,
        sections: [
          PieChartSectionData(
            value: 45,
            color: AppColors.primary,
            radius: 50,
            showTitle: false,
          ),
          PieChartSectionData(
            value: 30,
            color: Colors.blue,
            radius: 50,
            showTitle: false,
          ),
          PieChartSectionData(
            value: 15,
            color: Colors.purple,
            radius: 50,
            showTitle: false,
          ),
          PieChartSectionData(
            value: 10,
            color: Colors.teal,
            radius: 50,
            showTitle: false,
          ),
        ],
      ),
    );
  }
}

/// Legend item
class _LegendItem extends StatelessWidget {
  const _LegendItem({
    required this.color,
    required this.label,
    required this.value,
  });

  final Color color;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 12,
          height: 12,
          decoration: BoxDecoration(
            color: color,
            borderRadius: AppRadius.radiusSm,
          ),
        ),
        const SizedBox(width: AppSpacing.sm),
        Expanded(
          child: Text(
            label,
            style: AppTypography.labelMedium.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
        ),
        Text(
          value,
          style: AppTypography.labelMedium.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}

/// Period selection chip
class _PeriodChip extends StatelessWidget {
  const _PeriodChip({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: AppSpacing.sm),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.primary : AppColors.backgroundCard,
            borderRadius: AppRadius.radiusFull,
            border: Border.all(
              color: isSelected ? AppColors.primary : AppColors.border,
            ),
          ),
          child: Text(
            label,
            style: AppTypography.labelMedium.copyWith(
              color: isSelected
                  ? AppColors.backgroundDark
                  : AppColors.textSecondary,
            ),
          ),
        ),
      ),
    );
  }
}

/// Metric card widget
class _MetricCard extends StatelessWidget {
  const _MetricCard({
    required this.title,
    required this.value,
    required this.change,
    required this.isPositive,
    required this.icon,
  });

  final String title;
  final String value;
  final String change;
  final bool isPositive;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return PremiumCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 18, color: AppColors.primary),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: (isPositive ? AppColors.success : AppColors.error)
                      .withValues(alpha: 0.1),
                  borderRadius: AppRadius.radiusSm,
                ),
                child: Text(
                  change,
                  style: AppTypography.labelSmall.copyWith(
                    color: isPositive ? AppColors.success : AppColors.error,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          Text(
            value,
            style: AppTypography.headlineSmall.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            title,
            style: AppTypography.labelSmall.copyWith(
              color: AppColors.textMuted,
            ),
          ),
        ],
      ),
    );
  }
}

/// Score breakdown item
class _ScoreBreakdownItem extends StatelessWidget {
  const _ScoreBreakdownItem({
    required this.label,
    required this.value,
    required this.maxValue,
  });

  final String label;
  final int value;
  final int maxValue;

  @override
  Widget build(BuildContext context) {
    final progress = value / maxValue;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: AppTypography.labelMedium.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            Text(
              '$value%',
              style: AppTypography.labelMedium.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        const SizedBox(height: 4),
        ClipRRect(
          borderRadius: AppRadius.radiusFull,
          child: LinearProgressIndicator(
            value: progress,
            backgroundColor: AppColors.backgroundCardLight,
            valueColor: AlwaysStoppedAnimation<Color>(
              _getProgressColor(progress),
            ),
            minHeight: 6,
          ),
        ),
      ],
    );
  }

  Color _getProgressColor(double progress) {
    if (progress >= 0.8) return AppColors.success;
    if (progress >= 0.5) return AppColors.primary;
    if (progress >= 0.3) return Colors.orange;
    return AppColors.error;
  }
}

/// Activity item widget
class _ActivityItem extends StatelessWidget {
  const _ActivityItem({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.iconColor,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final Color iconColor;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: iconColor.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, size: 18, color: iconColor),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: AppTypography.bodyMedium),
                Text(
                  subtitle,
                  style: AppTypography.labelSmall.copyWith(
                    color: AppColors.textMuted,
                  ),
                ),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, color: AppColors.textMuted),
        ],
      ),
    );
  }
}
