import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import '../../controllers/auth_controller.dart';
import '../../controllers/patient_controller.dart';
import '../../themes/app_theme.dart';
import '../../routes/app_routes.dart';
import '../patient/glucose_readings_page.dart';
import '../patient/hba1c_reports_page.dart';
import '../patient/moods_page.dart';
import '../patient/nutrition_logs_page.dart';
import '../patient/workout_logs_page.dart';

class PatientDashboard extends StatelessWidget {
  const PatientDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    final authController = Get.find<AuthController>();
    final patientController = Get.put(PatientController());
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Patient Dashboard'),
        backgroundColor: AppTheme.primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () => Get.toNamed(AppRoutes.profile),
          ),
        ],
      ),
      drawer: _buildDrawer(context, authController),
      body: RefreshIndicator(
        onRefresh: () => patientController.refreshAll(),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildWelcomeSection(authController),
              const SizedBox(height: 24),
              _buildQuickActionsGrid(context),
              const SizedBox(height: 24),
              _buildHealthSummaryCards(patientController),
              const SizedBox(height: 24),
              _buildRecentActivitySection(patientController),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildWelcomeSection(AuthController authController) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppTheme.primaryColor,
            AppTheme.primaryColor.withOpacity(0.8),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 30,
                backgroundColor: Colors.white.withOpacity(0.2),
                child: Icon(
                  Icons.person,
                  size: 30,
                  color: Colors.white,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Welcome back,',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.9),
                        fontSize: 16,
                      ),
                    ),
                    Text(
                      authController.currentUser?.name ?? 'Patient',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            'Track your health journey and stay on top of your diabetes management',
            style: TextStyle(
              color: Colors.white.withOpacity(0.9),
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActionsGrid(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Quick Actions',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.grey[800],
          ),
        ),
        const SizedBox(height: 16),
        GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: 2,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          childAspectRatio: 1.2,
          children: [
            _buildActionCard(
              context,
              'Glucose Readings',
              Icons.monitor_heart,
              AppTheme.primaryColor,
              () => Get.toNamed(AppRoutes.patientGlucoseReadings),
            ),
            _buildActionCard(
              context,
              'HbA1c Reports',
              Icons.assessment,
              AppTheme.successColor,
              () => Get.toNamed(AppRoutes.patientHbA1cReports),
            ),
            _buildActionCard(
              context,
              'Mood Tracking',
              Icons.sentiment_satisfied,
              AppTheme.warningColor,
              () => Get.toNamed(AppRoutes.patientMoodTracking),
            ),
            _buildActionCard(
              context,
              'Nutrition Logs',
              Icons.restaurant,
              AppTheme.infoColor,
              () => Get.toNamed(AppRoutes.patientNutritionLogs),
            ),
            _buildActionCard(
              context,
              'Workout Logs',
              Icons.fitness_center,
              AppTheme.accentColor,
              () => Get.toNamed(AppRoutes.patientWorkoutLogs),
            ),
            _buildActionCard(
              context,
              'Community',
              Icons.people,
              AppTheme.secondaryColor,
              () => Get.snackbar('Coming Soon', 'Community features will be available soon!'),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildActionCard(
    BuildContext context,
    String title,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            gradient: LinearGradient(
              colors: [
                color.withOpacity(0.1),
                color.withOpacity(0.05),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  icon,
                  size: 32,
                  color: color,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                title,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Colors.grey[800],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHealthSummaryCards(PatientController patientController) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Health Summary',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.grey[800],
          ),
        ),
        const SizedBox(height: 16),
        Obx(() {
          return Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  'Average Glucose',
                  '${patientController.averageGlucose.toStringAsFixed(0)} mg/dL',
                  Icons.monitor_heart,
                  AppTheme.primaryColor,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildSummaryCard(
                  'Latest HbA1c',
                  '${patientController.latestHbA1c.toStringAsFixed(1)}%',
                  Icons.assessment,
                  AppTheme.successColor,
                ),
              ),
            ],
          );
        }),
        const SizedBox(height: 16),
        Obx(() {
          return Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  'Dominant Mood',
                  patientController.dominantMood,
                  Icons.sentiment_satisfied,
                  AppTheme.warningColor,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildSummaryCard(
                  'Workouts This Week',
                  '${patientController.totalWorkoutsThisWeek}',
                  Icons.fitness_center,
                  AppTheme.accentColor,
                ),
              ),
            ],
          );
        }),
      ],
    );
  }

  Widget _buildSummaryCard(
    String title,
    String value,
    IconData icon,
    Color color,
  ) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(
              icon,
              size: 24,
              color: color,
            ),
            const SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentActivitySection(PatientController patientController) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Recent Activity',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.grey[800],
          ),
        ),
        const SizedBox(height: 16),
        Obx(() {
          if (patientController.glucoseReadings.isEmpty &&
              patientController.nutritionLogs.isEmpty &&
              patientController.workoutLogs.isEmpty) {
            return Container(
              padding: const EdgeInsets.all(32),
              child: Column(
                children: [
                  Icon(
                    Icons.timeline,
                    size: 48,
                    color: Colors.grey[400],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No recent activity',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Start tracking your health data to see your activity here',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[500],
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            );
          }

          return Column(
            children: [
              if (patientController.glucoseReadings.isNotEmpty) ...[
                _buildActivityItem(
                  'Glucose Reading',
                  '${patientController.glucoseReadings.first.value} mg/dL',
                  DateFormat('MMM dd, HH:mm').format(patientController.glucoseReadings.first.readingTime),
                  Icons.monitor_heart,
                  AppTheme.primaryColor,
                ),
                const SizedBox(height: 8),
              ],
              if (patientController.nutritionLogs.isNotEmpty) ...[
                _buildActivityItem(
                  'Nutrition Log',
                  patientController.nutritionLogs.first.foodName,
                  DateFormat('MMM dd, HH:mm').format(patientController.nutritionLogs.first.mealTime),
                  Icons.restaurant,
                  AppTheme.infoColor,
                ),
                const SizedBox(height: 8),
              ],
              if (patientController.workoutLogs.isNotEmpty) ...[
                _buildActivityItem(
                  'Workout Log',
                  patientController.workoutLogs.first.exerciseType,
                  DateFormat('MMM dd, HH:mm').format(patientController.workoutLogs.first.workoutTime),
                  Icons.fitness_center,
                  AppTheme.accentColor,
                ),
              ],
            ],
          );
        }),
      ],
    );
  }

  Widget _buildActivityItem(
    String type,
    String value,
    String time,
    IconData icon,
    Color color,
  ) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            icon,
            size: 20,
            color: color,
          ),
        ),
        title: Text(
          type,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
        subtitle: Text(
          value,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[600],
          ),
        ),
        trailing: Text(
          time,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[500],
          ),
        ),
      ),
    );
  }

  Widget _buildDrawer(BuildContext context, AuthController authController) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(
              color: AppTheme.primaryColor,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CircleAvatar(
                  radius: 30,
                  backgroundColor: Colors.white.withOpacity(0.2),
                  child: Icon(
                    Icons.person,
                    size: 30,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  authController.currentUser?.name ?? 'Patient',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  authController.currentUser?.email ?? 'patient@example.com',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.8),
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          ListTile(
            leading: const Icon(Icons.dashboard),
            title: const Text('Dashboard'),
            onTap: () => Navigator.pop(context),
          ),
          ListTile(
            leading: const Icon(Icons.monitor_heart),
            title: const Text('Glucose Readings'),
            onTap: () {
              Navigator.pop(context);
              Get.toNamed(AppRoutes.patientGlucoseReadings);
            },
          ),
          ListTile(
            leading: const Icon(Icons.assessment),
            title: const Text('HbA1c Reports'),
            onTap: () {
              Navigator.pop(context);
              Get.toNamed(AppRoutes.patientHbA1cReports);
            },
          ),
          ListTile(
            leading: const Icon(Icons.sentiment_satisfied),
            title: const Text('Mood Tracking'),
            onTap: () {
              Navigator.pop(context);
              Get.toNamed(AppRoutes.patientMoodTracking);
            },
          ),
          ListTile(
            leading: const Icon(Icons.restaurant),
            title: const Text('Nutrition Logs'),
            onTap: () {
              Navigator.pop(context);
              Get.toNamed(AppRoutes.patientNutritionLogs);
            },
          ),
          ListTile(
            leading: const Icon(Icons.fitness_center),
            title: const Text('Workout Logs'),
            onTap: () {
              Navigator.pop(context);
              Get.toNamed(AppRoutes.patientWorkoutLogs);
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.person),
            title: const Text('Profile'),
            onTap: () {
              Navigator.pop(context);
              Get.toNamed(AppRoutes.profile);
            },
          ),
          ListTile(
            leading: const Icon(Icons.settings),
            title: const Text('Settings'),
            onTap: () => Get.snackbar('Coming Soon', 'Settings will be available soon!'),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout, color: Colors.red),
            title: const Text('Logout', style: TextStyle(color: Colors.red)),
            onTap: () {
              Navigator.pop(context);
              authController.logout();
            },
          ),
        ],
      ),
    );
  }
}
