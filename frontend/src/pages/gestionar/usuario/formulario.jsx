import { useParams } from 'react-router-dom';
import { CrudForm } from '../../../components/CrudForm';
import { getUsuarioById, createUsuario, updateUsuario, deleteUsuario } from '../../../api/crud_modelos/usuario';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-hot-toast';

// Componente para el campo de confirmación de contraseña
function ConfirmPasswordField() {
  const { register, watch, formState: { errors } } = useFormContext();
  const password = watch('password');
  const { id } = useParams();
  const isEditing = !!id;

  const validateConfirm = (value) => {
    if (!password && !isEditing) return true;
    if (password && value !== password) return 'Las contraseñas no coinciden';
    return true;
  };

  return (
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-2">Confirmar contraseña</label>
      <input
        type="password"
        {...register('confirm_password', { validate: validateConfirm })}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
      />
      {errors.confirm_password && (
        <span className="text-red-600 text-sm mt-1">{errors.confirm_password.message}</span>
      )}
    </div>
  );
}

// Componente para los checkboxes de roles (alineados verticalmente)
function RoleCheckboxes() {
  const { register } = useFormContext();

  return (
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-2">Roles</label>
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input type="checkbox" {...register('is_active')} defaultChecked={true} className="w-4 h-4" />
          <span className="text-gray-700">Activo</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" {...register('is_staff')} className="w-4 h-4" />
          <span className="text-gray-700">Staff (admin)</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" {...register('is_superuser')} className="w-4 h-4" />
          <span className="text-gray-700">Superusuario</span>
        </label>
      </div>
    </div>
  );
}

export function UsuarioForm() {
  const { id } = useParams();
  const isEditing = !!id;

  // Campos principales (sin los checkboxes de roles)
  const fields = [
    { name: 'username', label: 'Nombre de usuario', type: 'text', required: true },
    { name: 'email', label: 'Correo electrónico', type: 'email', required: false },
    { name: 'first_name', label: 'Nombre', type: 'text', required: false },
    { name: 'last_name', label: 'Apellidos', type: 'text', required: false },
    {
      name: 'password',
      label: isEditing ? 'Contraseña (dejar en blanco para no cambiar)' : 'Contraseña *',
      type: 'password',
      required: !isEditing,
    },
  ];

  const getItemWithTransform = async (id) => {
    const data = await getUsuarioById(id);
    return { ...data, password: '', confirm_password: '' };
  };

  const customValidate = (data) => {
    if (!isEditing && !data.password) {
      toast.error('La contraseña es obligatoria');
      return false;
    }
    if (data.password && data.password.length < 4) {
      toast.error('La contraseña debe tener al menos 4 caracteres');
      return false;
    }
    return true;
  };

  const createWrapper = async (data) => {
    const { confirm_password, ...rest } = data;
    if (!rest.password) throw new Error('La contraseña es obligatoria');
    return createUsuario(rest);
  };

  const updateWrapper = async (id, data) => {
    const { confirm_password, ...rest } = data;
    if (!rest.password) delete rest.password;
    return updateUsuario(id, rest);
  };

  return (
    <CrudForm
      title={isEditing ? 'Editar Usuario' : 'Crear Usuario'}
      fields={fields}
      getItem={isEditing ? getItemWithTransform : undefined}
      createItem={createWrapper}
      updateItem={updateWrapper}
      deleteItem={deleteUsuario}
      basePath="/gestionar/usuario"
      itemName="Usuario"
      initialData={isEditing ? undefined : { is_active: true, is_staff: false, is_superuser: false }}
      customValidate={customValidate}
    >
      {/* Campo de confirmación de contraseña */}
      <ConfirmPasswordField />
      {/* Checkboxes de roles alineados verticalmente */}
      <RoleCheckboxes />
    </CrudForm>
  );
}