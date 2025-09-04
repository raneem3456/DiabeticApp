import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../controllers/auth_controller.dart';

class PatientHbA1cReportsPage extends StatelessWidget {
  const PatientHbA1cReportsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final authController = AuthController.to;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('HbA1c Reports'),
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
              'HbA1c Reports',
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
                        Icons.assessment,
                        size: 64,
                        color: Colors.green,
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'HbA1c Reports',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'View your HbA1c test results and track your long-term glucose control.',
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton.icon(
                        onPressed: () {
                          Get.snackbar(
                            'Feature Coming Soon',
                            'HbA1c reports functionality will be implemented here.',
                            snackPosition: SnackPosition.BOTTOM,
                          );
                        },
                        icon: const Icon(Icons.visibility),
                        label: const Text('View Reports'),
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
