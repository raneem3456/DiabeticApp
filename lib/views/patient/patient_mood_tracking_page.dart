import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../controllers/auth_controller.dart';

class PatientMoodTrackingPage extends StatelessWidget {
  const PatientMoodTrackingPage({super.key});

  @override
  Widget build(BuildContext context) {
    final authController = AuthController.to;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mood Tracking'),
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
              'Mood Tracking',
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
                        Icons.mood,
                        size: 64,
                        color: Colors.pink,
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'Mood & Wellbeing',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Track your mood, stress levels, and overall wellbeing to better understand your health patterns.',
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton.icon(
                        onPressed: () {
                          Get.snackbar(
                            'Feature Coming Soon',
                            'Mood tracking functionality will be implemented here.',
                            snackPosition: SnackPosition.BOTTOM,
                          );
                        },
                        icon: const Icon(Icons.add),
                        label: const Text('Log Mood'),
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
