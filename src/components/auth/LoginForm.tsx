import { useNavigate, Link } from 'react-router-dom';
import { useForm } from '@/hooks/useForm';
import { useAuth } from '@/contexts/AuthContext';
import { FormField, Input } from '@/components/form/FormField';
import { Button } from '@/components/common/Button';
import { required, email, compose } from '@/utils/validation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { LoginCredentials } from '@/types';

interface LoginFormData {
  emailPrefix: string;
  password: string;
}

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const {
    errors,
    touched,
    isValid,
    handleSubmit,
    getFieldProps,
  } = useForm<LoginFormData>({
    initialValues: {
      emailPrefix: '',
      password: '',
    },
    validationRules: {
      emailPrefix: compose(
        required('사용자명을 입력해주세요.'),
        (value: string) => {
          const fullEmail = `${value}@koreatech.ac.kr`;
          const emailValidation = email('올바른 이메일 형식이 아닙니다.');
          return emailValidation(fullEmail);
        }
      ),
      password: required('비밀번호를 입력해주세요.'),
    },
    validateOnBlur: true,
    onSubmit: async (formData) => {
      const credentials: LoginCredentials = {
        email: `${formData.emailPrefix}@koreatech.ac.kr`,
        password: formData.password,
      };

      try {
        await login(credentials);
        navigate('/', { replace: true });
      } catch (error) {
        // 에러는 useForm에서 처리되거나 상위 컴포넌트에서 처리됨
        throw error;
      }
    },
  });

  if (isLoading) {
    return <LoadingSpinner message="로그인 중..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🍱</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            K-Food 로그인
          </h1>
          <p className="text-gray-600">맛있는 식단 정보를 확인해보세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            label="학교 이메일"
            htmlFor="emailPrefix"
            required
            error={touched.emailPrefix ? errors.emailPrefix?.message : undefined}
          >
            <div className="relative">
              <Input
                id="emailPrefix"
                type="text"
                placeholder="사용자명"
                className="pr-40"
                {...getFieldProps('emailPrefix')}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 text-sm">@koreatech.ac.kr</span>
              </div>
            </div>
          </FormField>

          <FormField
            label="비밀번호"
            htmlFor="password"
            required
            error={touched.password ? errors.password?.message : undefined}
          >
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              {...getFieldProps('password')}
            />
          </FormField>

          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            disabled={!isValid || isLoading}
          >
            로그인
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <Link
              to="/auth/register"
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
