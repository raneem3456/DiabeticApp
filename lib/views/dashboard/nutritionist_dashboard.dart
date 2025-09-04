import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../controllers/auth_controller.dart';
import '../../themes/app_theme.dart';

class NutritionistDashboard extends StatelessWidget {
  const NutritionistDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    final authController = Get.find<AuthController>();
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Nutritionist Dashboard'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.restaurant_menu,
              size: 80,
              color: AppTheme.nutritionistColor,
            ),
            const SizedBox(height: 24),
            Text(
              'Nutritionist Dashboard',
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                color: AppTheme.nutritionistColor,
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
              'This dashboard will include:\n• Meal Planning\n• Nutrition Analysis\n• Patient Dietary Guidelines\n• Food Database\n• Recipe Management',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }
}
