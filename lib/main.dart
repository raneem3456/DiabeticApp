import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'routes/app_routes.dart';
import 'themes/app_theme.dart';
import 'controllers/auth_controller.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize GetStorage
  await GetStorage.init();
  
  runApp(const DiabeticApp());
}

class DiabeticApp extends StatelessWidget {
  const DiabeticApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'Diabetic App',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      
      // Initialize AuthController
      initialBinding: BindingsBuilder(() {
        Get.put(AuthController());
      }),
      
      // Routes
      initialRoute: AppRoutes.splash,
      getPages: AppRoutes.routes,
      
      // Default transitions
      defaultTransition: Transition.fadeIn,
      
      // Error handling
      onUnknownRoute: (settings) {
        return GetPageRoute(
          page: () => const Scaffold(
            body: Center(
              child: Text('Page not found'),
            ),
          ),
        );
      },
    );
  }
}
