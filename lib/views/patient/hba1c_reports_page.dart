import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import '../../controllers/patient_controller.dart';
import '../../models/patient_models.dart';
import '../../themes/app_theme.dart';

class HbA1cReportsPage extends StatelessWidget {
  const HbA1cReportsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<PatientController>();
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('HbA1c Reports'),
        backgroundColor: AppTheme.primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () => _showFilterDialog(context, controller),
          ),
        ],
      ),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const Center(child: CircularProgressIndicator());
        }
        
        if (controller.hbA1cReports.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.assessment_outlined,
                  size: 64,
                  color: Colors.grey[400],
                ),
                const SizedBox(height: 16),
                Text(
                  'No HbA1c reports yet',
                  style: TextStyle(
                    fontSize: 18,
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Add your first report to start tracking',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[500],
                  ),
                ),
              ],
            ),
          );
        }
        
        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: controller.hbA1cReports.length,
          itemBuilder: (context, index) {
            final report = controller.hbA1cReports[index];
            return _HbA1cReportCard(
              report: report,
              onEdit: () => _showEditDialog(context, controller, report),
              onDelete: () => _showDeleteDialog(context, controller, report),
            );
          },
        );
      }),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddDialog(context, controller),
        backgroundColor: AppTheme.primaryColor,
        foregroundColor: Colors.white,
        child: const Icon(Icons.add),
      ),
    );
  }

  void _showAddDialog(BuildContext context, PatientController controller) {
    showDialog(
      context: context,
      builder: (context) => _HbA1cReportDialog(
        controller: controller,
        report: null,
      ),
    );
  }

  void _showEditDialog(BuildContext context, PatientController controller, HbA1cReport report) {
    showDialog(
      context: context,
      builder: (context) => _HbA1cReportDialog(
        controller: controller,
        report: report,
      ),
    );
  }

  void _showDeleteDialog(BuildContext context, PatientController controller, HbA1cReport report) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Report'),
        content: Text('Are you sure you want to delete this HbA1c report?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              controller.deleteHbA1cReport(report.id);
              Navigator.of(context).pop();
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  void _showFilterDialog(BuildContext context, PatientController controller) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Filter Reports'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              decoration: const InputDecoration(
                labelText: 'Min Value (%)',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
              onChanged: (value) => controller.setMinGlucoseFilter(value),
            ),
            const SizedBox(height: 16),
            TextField(
              decoration: const InputDecoration(
                labelText: 'Max Value (%)',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
              onChanged: (value) => controller.setMaxGlucoseFilter(value),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              controller.applyGlucoseFilters();
              Navigator.of(context).pop();
            },
            child: const Text('Apply'),
          ),
        ],
      ),
    );
  }
}

class _HbA1cReportCard extends StatelessWidget {
  final HbA1cReport report;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const _HbA1cReportCard({
    required this.report,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final isHigh = report.hba1cValue > 6.5;
    final isNormal = report.hba1cValue <= 6.5;
    
    Color statusColor;
    IconData statusIcon;
    String statusText;
    
    if (isHigh) {
      statusColor = AppTheme.errorColor;
      statusIcon = Icons.trending_up;
      statusText = 'High Risk';
    } else {
      statusColor = AppTheme.successColor;
      statusIcon = Icons.check_circle;
      statusText = 'Normal';
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    statusIcon,
                    color: statusColor,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${report.hba1cValue.toStringAsFixed(1)}%',
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        statusText,
                        style: TextStyle(
                          color: statusColor,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                PopupMenuButton<String>(
                  onSelected: (value) {
                    if (value == 'edit') onEdit();
                    if (value == 'delete') onDelete();
                  },
                  itemBuilder: (context) => [
                    const PopupMenuItem(
                      value: 'edit',
                      child: Row(
                        children: [
                          Icon(Icons.edit, size: 20),
                          SizedBox(width: 8),
                          Text('Edit'),
                        ],
                      ),
                    ),
                    const PopupMenuItem(
                      value: 'delete',
                      child: Row(
                        children: [
                          Icon(Icons.delete, size: 20),
                          SizedBox(width: 8),
                          Text('Delete'),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _InfoChip(
                  icon: Icons.access_time,
                  label: DateFormat('MMM dd, yyyy').format(report.testDate),
                ),
                const SizedBox(width: 8),
                _InfoChip(
                  icon: Icons.location_on,
                  label: report.labName ?? 'Unknown Lab',
                ),
                const SizedBox(width: 8),
                _InfoChip(
                  icon: Icons.person,
                  label: 'Patient',
                ),
              ],
            ),
            if (report.notes?.isNotEmpty == true) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  report.notes!,
                  style: TextStyle(
                    color: Colors.grey[700],
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ),
            ],
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.blue[50],
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.blue[200]!),
              ),
              child: Row(
                children: [
                  Icon(Icons.info_outline, color: Colors.blue[600], size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'HbA1c measures average blood glucose over 2-3 months. Target: <6.5%',
                      style: TextStyle(
                        color: Colors.blue[700],
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _InfoChip({
    required this.icon,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: Colors.grey[600]),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }
}

class _HbA1cReportDialog extends StatefulWidget {
  final PatientController controller;
  final HbA1cReport? report;

  const _HbA1cReportDialog({
    required this.controller,
    this.report,
  });

  @override
  State<_HbA1cReportDialog> createState() => _HbA1cReportDialogState();
}

class _HbA1cReportDialogState extends State<_HbA1cReportDialog> {
  final _formKey = GlobalKey<FormState>();
  final _valueController = TextEditingController();
  final _labNameController = TextEditingController();
  final _orderedByController = TextEditingController();
  final _notesController = TextEditingController();
  DateTime _selectedDate = DateTime.now();

  @override
  void initState() {
    super.initState();
    if (widget.report != null) {
      _valueController.text = widget.report!.hba1cValue.toString();
      _labNameController.text = widget.report!.labName ?? '';
              _orderedByController.text = '';
      _notesController.text = widget.report!.notes ?? '';
      _selectedDate = widget.report!.testDate;
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(widget.report == null ? 'Add HbA1c Report' : 'Edit HbA1c Report'),
      content: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                controller: _valueController,
                decoration: const InputDecoration(
                  labelText: 'HbA1c Value (%)',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.assessment),
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter HbA1c value';
                  }
                  final num = double.tryParse(value);
                  if (num == null || num <= 0 || num > 20) {
                    return 'Please enter a valid percentage (0-20%)';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _labNameController,
                decoration: const InputDecoration(
                  labelText: 'Lab Name',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.location_on),
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _orderedByController,
                decoration: const InputDecoration(
                  labelText: 'Ordered By',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.person),
                ),
              ),
              const SizedBox(height: 16),
              InkWell(
                onTap: () async {
                  final date = await showDatePicker(
                    context: context,
                    initialDate: _selectedDate,
                    firstDate: DateTime.now().subtract(const Duration(days: 365)),
                    lastDate: DateTime.now().add(const Duration(days: 1)),
                  );
                  if (date != null) {
                    setState(() {
                      _selectedDate = date;
                    });
                  }
                },
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.calendar_today, size: 20),
                      const SizedBox(width: 8),
                      Text(
                        DateFormat('MMM dd, yyyy').format(_selectedDate),
                        style: const TextStyle(fontSize: 16),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _notesController,
                decoration: const InputDecoration(
                  labelText: 'Notes (Optional)',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.note),
                ),
                maxLines: 3,
              ),
            ],
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: _submit,
          child: Text(widget.report == null ? 'Add' : 'Update'),
        ),
      ],
    );
  }

  void _submit() {
    if (_formKey.currentState!.validate()) {
      final data = {
        'value': double.parse(_valueController.text),
        'test_date': _selectedDate.toIso8601String(),
        'lab_name': _labNameController.text.isEmpty ? null : _labNameController.text,
        'ordered_by': null,
        'notes': _notesController.text.isEmpty ? null : _notesController.text,
      };

      if (widget.report == null) {
        widget.controller.createHbA1cReport(data);
      } else {
        widget.controller.updateHbA1cReport(widget.report!.id, data);
      }

      Navigator.of(context).pop();
    }
  }

  @override
  void dispose() {
    _valueController.dispose();
    _labNameController.dispose();
    _orderedByController.dispose();
    _notesController.dispose();
    super.dispose();
  }
}
