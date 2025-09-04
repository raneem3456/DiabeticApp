import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../controllers/auth_controller.dart';
import '../../themes/app_theme.dart';

class DoctorDashboard extends StatelessWidget {
  const DoctorDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    final authController = Get.find<AuthController>();
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Doctor Dashboard'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.medical_services,
              size: 80,
              color: AppTheme.doctorColor,
            ),
            const SizedBox(height: 24),
            Text(
              'Doctor Dashboard',
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                color: AppTheme.doctorColor,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Welcome, Dr. ${authController.userName}',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 24),
            const Text(
              'This dashboard will include:\n• Patient Overview\n• Reports & Analytics\n• Medications Management\n• Lab Orders\n• Patient Notes',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }
}
