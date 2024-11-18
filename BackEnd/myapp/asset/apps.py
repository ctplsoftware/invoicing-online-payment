from django.apps import AppConfig
from django.db.models.signals import post_migrate

class AssetConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'asset'

    def ready(self):
        # Connect the post_migrate signal
        post_migrate.connect(self.create_default_groups_and_permissions, sender=self)

    def create_default_groups_and_permissions(self, sender, **kwargs):
        # Import models inside the function to avoid AppRegistryNotReady errors
        from django.contrib.auth.models import Group, Permission

        # Define default groups
        default_groups = [
            {'id': 1, 'name': 'Admin'},
            {'id': 2, 'name': 'User'},
            {'id': 3, 'name': 'Customer'},
        ]

        # Ensure groups exist
        for group_data in default_groups:
            Group.objects.update_or_create(
                id=group_data['id'],
                defaults={'name': group_data['name']}
            )

        # Define group permissions (group_id, permission_id)
        group_permissions = [
            {'group_id': 1, 'permission_id': 4},  # Admin permissions
        ]

        # Ensure permissions exist in the groups
        for gp in group_permissions:
            try:
                group = Group.objects.get(id=gp['group_id'])
                permission = Permission.objects.get(id=gp['permission_id'])
                group.permissions.add(permission)  # Add permission to group
            except Group.DoesNotExist:
                print(f"Warning: Group ID {gp['group_id']} does not exist.")
            except Permission.DoesNotExist:
                print(f"Warning: Permission ID {gp['permission_id']} does not exist.")
