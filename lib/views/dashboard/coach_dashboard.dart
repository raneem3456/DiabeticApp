import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../controllers/auth_controller.dart';
import '../../themes/app_theme.dart';

class CoachDashboard extends StatelessWidget {
  const CoachDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    final authController = Get.find<AuthController>();
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Coach Dashboard'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.fitness_center,
              size: 80,
              color: AppTheme.coachColor,
            ),
            const SizedBox(height: 24),
            Text(
              'Coach Dashboard',
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                color: AppTheme.coachColor,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Welcome, ${authController.userName}',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 24),
            const Text(
              'This dashboard will include:\n• Exercise Programs\n• Workout Plans\n• Fitness Tracking\n• Patient Progress\n• Activity Recommendations',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }
}
