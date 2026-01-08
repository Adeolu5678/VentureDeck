/// VentureDeck Mobile - Home Screen
library;

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:venturedeck_mobile/core/theme/app_theme.dart';

/// Home screen with bottom navigation
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  final List<Widget> _screens = [
    const _DashboardTab(),
    const _ProjectsTab(),
    const _InvestorsTab(),
    const _MessagesTab(),
    const _ProfileTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_selectedIndex],
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: AppColors.border, width: 0.5)),
        ),
        child: BottomNavigationBar(
          currentIndex: _selectedIndex,
          onTap: (index) => setState(() => _selectedIndex = index),
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.dashboard_outlined),
              activeIcon: Icon(Icons.dashboard),
              label: 'Dashboard',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.rocket_launch_outlined),
              activeIcon: Icon(Icons.rocket_launch),
              label: 'Projects',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.people_outline),
              activeIcon: Icon(Icons.people),
              label: 'Investors',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.chat_bubble_outline),
              activeIcon: Icon(Icons.chat_bubble),
              label: 'Messages',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_outline),
              activeIcon: Icon(Icons.person),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}

/// Dashboard tab placeholder
class _DashboardTab extends StatelessWidget {
  const _DashboardTab();

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: CustomScrollView(
        slivers: [
          SliverAppBar(
            floating: true,
            title: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(AppSpacing.sm),
                  decoration: const BoxDecoration(
                    gradient: AppColors.primaryGradient,
                    borderRadius: AppRadius.radiusSm,
                  ),
                  child: const Icon(
                    Icons.diamond_outlined,
                    color: AppColors.backgroundDark,
                    size: 20,
                  ),
                ),
                const SizedBox(width: AppSpacing.sm),
                Text('VentureDeck', style: AppTypography.headlineMedium),
              ],
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.notifications_outlined),
                onPressed: () {},
              ),
            ],
          ),
          SliverPadding(
            padding: const EdgeInsets.all(AppSpacing.md),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                _buildWelcomeCard(context),
                const SizedBox(height: AppSpacing.md),
                _buildQuickStats(context),
                const SizedBox(height: AppSpacing.lg),
                _buildSectionTitle('Recent Activity'),
                const SizedBox(height: AppSpacing.sm),
                _buildPlaceholderCard('Connect to Convex to see activity'),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWelcomeCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        gradient: AppColors.primaryGradient,
        borderRadius: AppRadius.radiusLg,
        boxShadow: AppShadows.glow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Welcome back!',
            style: AppTypography.headlineLarge.copyWith(
              color: AppColors.backgroundDark,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            'Your portfolio is looking great today.',
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.backgroundDark.withValues(alpha: 0.8),
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.1, end: 0);
  }

  Widget _buildQuickStats(BuildContext context) {
    return Row(
      children: [
        Expanded(child: _buildStatCard('Projects', '0', Icons.rocket)),
        const SizedBox(width: AppSpacing.md),
        Expanded(child: _buildStatCard('Investors', '0', Icons.people)),
        const SizedBox(width: AppSpacing.md),
        Expanded(child: _buildStatCard('Messages', '0', Icons.message)),
      ],
    ).animate().fadeIn(delay: 200.ms, duration: 400.ms);
  }

  Widget _buildStatCard(String label, String value, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.backgroundCard,
        borderRadius: AppRadius.radiusMd,
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          Icon(icon, color: AppColors.primary, size: 24),
          const SizedBox(height: AppSpacing.sm),
          Text(value, style: AppTypography.headlineMedium),
          Text(label, style: AppTypography.labelSmall),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(title, style: AppTypography.headlineSmall);
  }

  Widget _buildPlaceholderCard(String message) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.xl),
      decoration: BoxDecoration(
        color: AppColors.backgroundCard,
        borderRadius: AppRadius.radiusMd,
        border: Border.all(color: AppColors.border),
      ),
      child: Center(
        child: Column(
          children: [
            const Icon(
              Icons.cloud_off_outlined,
              color: AppColors.textTertiary,
              size: 48,
            ),
            const SizedBox(height: AppSpacing.md),
            Text(
              message,
              style: AppTypography.bodyMedium,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

/// Projects tab placeholder
class _ProjectsTab extends StatelessWidget {
  const _ProjectsTab();

  @override
  Widget build(BuildContext context) {
    return const _PlaceholderScreen(
      title: 'Projects',
      icon: Icons.rocket_launch,
    );
  }
}

/// Investors tab placeholder
class _InvestorsTab extends StatelessWidget {
  const _InvestorsTab();

  @override
  Widget build(BuildContext context) {
    return const _PlaceholderScreen(title: 'Investors', icon: Icons.people);
  }
}

/// Messages tab placeholder
class _MessagesTab extends StatelessWidget {
  const _MessagesTab();

  @override
  Widget build(BuildContext context) {
    return const _PlaceholderScreen(title: 'Messages', icon: Icons.chat_bubble);
  }
}

/// Profile tab placeholder
class _ProfileTab extends StatelessWidget {
  const _ProfileTab();

  @override
  Widget build(BuildContext context) {
    return const _PlaceholderScreen(title: 'Profile', icon: Icons.person);
  }
}

/// Generic placeholder screen
class _PlaceholderScreen extends StatelessWidget {
  const _PlaceholderScreen({required this.title, required this.icon});

  final String title;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 64,
              color: AppColors.primary,
            ).animate().scale(delay: 100.ms, duration: 400.ms),
            const SizedBox(height: AppSpacing.md),
            Text(
              title,
              style: AppTypography.headlineLarge,
            ).animate().fadeIn(delay: 200.ms, duration: 400.ms),
            const SizedBox(height: AppSpacing.sm),
            Text(
              'Coming soon...',
              style: AppTypography.bodyMedium,
            ).animate().fadeIn(delay: 300.ms, duration: 400.ms),
          ],
        ),
      ),
    );
  }
}
