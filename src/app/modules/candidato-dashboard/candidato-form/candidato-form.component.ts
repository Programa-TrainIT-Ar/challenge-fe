import { HttpClient } from '@angular/common/http';
import {
  Component,
  ViewEncapsulation,
  AfterViewChecked,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Country {
  name: string;
  code: string;
  flag: string;
}

@Component({
  selector: 'app-candidato-form',
  templateUrl: './candidato-form.component.html',
  styleUrls: ['./candidato-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CandidatoFormComponent implements AfterViewChecked, OnInit {
  form!: FormGroup;

  countries: Country[] = [
    { name: 'Argentina', code: 'AR', flag: '🇦🇷' },
    { name: 'Bolivia', code: 'BO', flag: '🇧🇴' },
    { name: 'Brasil', code: 'BR', flag: '🇧🇷' },
    { name: 'Chile', code: 'CL', flag: '🇨🇱' },
    { name: 'Colombia', code: 'CO', flag: '🇨🇴' },
    { name: 'Costa Rica', code: 'CR', flag: '🇨🇷' },
    { name: 'Cuba', code: 'CU', flag: '🇨🇺' },
    { name: 'Ecuador', code: 'EC', flag: '🇪🇨' },
    { name: 'El Salvador', code: 'SV', flag: '🇸🇻' },
    { name: 'Guatemala', code: 'GT', flag: '🇬🇹' },
    { name: 'Honduras', code: 'HN', flag: '🇭🇳' },
    { name: 'México', code: 'MX', flag: '🇲🇽' },
    { name: 'Nicaragua', code: 'NI', flag: '🇳🇮' },
    { name: 'Panamá', code: 'PA', flag: '🇵🇦' },
    { name: 'Paraguay', code: 'PY', flag: '🇵🇾' },
    { name: 'Perú', code: 'PE', flag: '🇵🇪' },
    { name: 'República Dominicana', code: 'DO', flag: '🇩🇴' },
    { name: 'Uruguay', code: 'UY', flag: '🇺🇾' },
  ];

  roles = [
    { name: 'Frontend Developer' },
    { name: 'Backend Developer' },
    { name: 'Fullstack Developer' },
    { name: 'DevOps Engineer' },
    { name: 'QA Engineer' },
    { name: 'UI/UX Designer' },
    { name: 'Product Manager' },
    { name: 'Scrum Master' },
  ];

  levels = [
    { label: 'Trainee', value: 'trainee' },
    { label: 'Junior', value: 'junior' },
    { label: 'Semi Senior', value: 'semi senior' },
    { label: 'Senior', value: 'senior' },
  ];

  languages = [
    { name: 'JavaScript' },
    { name: 'TypeScript' },
    { name: 'Python' },
    { name: 'Java' },
    { name: 'Go' },
    { name: 'AWS' },
    { name: 'Node.js' },
    { name: 'Angular' },
    { name: 'React' },
    { name: 'Django' },
  ];

  chipColors: Record<string, string> = {
    JavaScript: '#E5C200',
    TypeScript: '#3178C6',
    Python: '#3776AB',
    Java: '#E76F00',
    Go: '#00ADD8',
    AWS: '#FF9900',
    'Node.js': '#339933',
    Angular: '#DD0031',
    React: '#61DAFB',
    Django: '#092E20',
  };

  availabilities = [
    { name: '10 horas/semana' },
    { name: '20 horas/semana' },
    { name: '30 horas/semana' },
    { name: '40 horas/semana (Tiempo completo)' },
    { name: 'Más de 40 horas/semana' },
  ];

  registroExitoso = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      country: [null, Validators.required],
      role: [null, Validators.required],
      languages: [[], Validators.required],
      level: [null, Validators.required],
      availability: [null, Validators.required],
    });
  }

  /** Limita selección de lenguajes a máximo 5 */
  validateSelection(event: any) {
    const selected = this.form.get('languages')?.value || [];
    if (selected.length > 5) {
      selected.pop();
      this.form.get('languages')?.setValue(selected);
    }
  }

  get selectionError(): boolean {
    const selected = this.form.get('languages')?.value || [];
    return selected.length < 1 || selected.length > 5;
  }

  /** Devuelve color dinámico para chips de lenguajes */
  getChipColor(languageName: string) {
    return this.chipColors[languageName] || '#303030';
  }

  /** Aplica color dinámico a los tokens multiselect */
  ngAfterViewChecked() {
    const tokens = document.querySelectorAll('.p-multiselect-token');
    tokens.forEach((token: any) => {
      const languageName = token.textContent.trim();
      const color = this.chipColors[languageName] || '#303030';
      token.style.backgroundColor = color;
      token.style.color = '#ffffff';
    });
  }

  /** Envía datos listos para backend */
  submit() {
    if (this.form.valid && !this.selectionError) {
      const payload = {
        country: this.form.value.country?.name,
        role: this.form.value.role?.name,
        languages: this.form.value.languages.map((l: any) => l.name),
        level: this.form.value.level?.label,
        availability: this.form.value.availability?.name,
      };

      this.http
        .post('', payload)
        .subscribe({
          next: res => {
            console.log('📤 Datos enviados correctamente:', res);
            this.registroExitoso = true;
            window.alert('✅ Registro actualizado con éxito');
          },
          error: err => {
            console.error('❌ Error al enviar datos:', err);
            window.alert('⚠ Ocurrió un error al enviar tus datos');
          },
        });
    } else {
      window.alert('⚠ Faltan campos por llenar');
      this.form.markAllAsTouched();
    }
  }
}
