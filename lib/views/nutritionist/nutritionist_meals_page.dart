import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../controllers/auth_controller.dart';

class NutritionistMealsPage extends StatelessWidget {
  const NutritionistMealsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final authController = AuthController.to;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Meals'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Welcome, ${authController.userName}!',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 16),
            const Text(
              'Meal Management',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      const Icon(
                        Icons.restaurant,
                        size: 64,
                        color: Colors.orange,
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'Meal Database',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Create and manage a comprehensive database of meals and nutritional information.',
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton.icon(
                        onPressed: () {
                          Get.snackbar(
                            'Feature Coming Soon',
                            'Meal management functionality will be implemented here.',
                            snackPosition: SnackPosition.BOTTOM,
                          );
                        },
                        icon: const Icon(Icons.add),
                        label: const Text('Add Meal'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
