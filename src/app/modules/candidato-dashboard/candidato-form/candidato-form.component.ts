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

  chipColors: any = {
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

  registroExitoso = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      country: [null, Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
      languages: [[], Validators.required],
      level: [null, Validators.required],
      availability: ['', Validators.required],
    });
  }

  // ✅ Validación de selección de lenguajes (entre 1 y 5)
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

  // ✅ Colores dinámicos en los chips
  getChipColor(languageName: string) {
    return this.chipColors[languageName] || '#303030';
  }

  ngAfterViewChecked() {
    const tokens = document.querySelectorAll('.p-multiselect-token');
    tokens.forEach((token: any) => {
      const languageName = token.textContent.trim();
      const color = this.chipColors[languageName] || '#303030';
      token.style.backgroundColor = color;
      token.style.color = '#ffffff';
    });
  }

  submit() {
    if (this.form.valid && !this.selectionError) {
      const payload = {
        country: this.form.value.country.name,
        phone: this.form.value.phone,
        languages: this.form.value.languages.map((l: any) => l.name),
        level: this.form.value.level.label,
        availability: this.form.value.availability,
      };
      console.log('📤 Datos listos para backend:', payload);

      // Alerta de éxito
      window.alert('✅ Registro actualizado con éxito');
    } else {
      // Alerta de campos incompletos
      window.alert('⚠ Faltan campos por llenar');
      this.form.markAllAsTouched();
    }
  }
}
