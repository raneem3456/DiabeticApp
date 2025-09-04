import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../controllers/auth_controller.dart';

class DoctorLabOrdersPage extends StatelessWidget {
  const DoctorLabOrdersPage({super.key});

  @override
  Widget build(BuildContext context) {
    final authController = AuthController.to;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Lab Orders'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Welcome, Dr. ${authController.userName}!',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 16),
            const Text(
              'Lab Orders',
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
                        Icons.science,
                        size: 64,
                        color: Colors.purple,
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'Laboratory Orders',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Order lab tests, view results, and track patient laboratory data.',
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton.icon(
                        onPressed: () {
                          Get.snackbar(
                            'Feature Coming Soon',
                            'Lab orders functionality will be implemented here.',
                            snackPosition: SnackPosition.BOTTOM,
                          );
                        },
                        icon: const Icon(Icons.add),
                        label: const Text('Order Lab Test'),
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
